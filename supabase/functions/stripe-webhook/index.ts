import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@13.6.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Initial request logging
  console.log('Webhook received:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries()),
  });

  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    // Log the raw request body for debugging
    const rawBody = await req.text();
    console.log('Raw webhook body:', rawBody);

    const stripeSignature = req.headers.get('stripe-signature');
    if (!stripeSignature) {
      console.error('No Stripe signature found in request headers');
      throw new Error('No Stripe signature found');
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('Webhook secret not configured in environment');
      throw new Error('Webhook secret not configured');
    }

    console.log('Initializing Stripe with secret key');
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Verify the webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        stripeSignature,
        webhookSecret
      );
      console.log('Webhook signature verified successfully. Event type:', event.type);
    } catch (err) {
      console.error('Error verifying webhook signature:', err);
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }

    // Initialize Supabase client
    console.log('Initializing Supabase client');
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    if (event.type === 'checkout.session.completed') {
      console.log('Processing checkout.session.completed event');
      const session = event.data.object;
      const labScriptId = session.metadata?.lab_script_id;

      console.log('Session data:', {
        id: session.id,
        customer: session.customer,
        labScriptId: labScriptId,
        paymentStatus: session.payment_status,
        amount: session.amount_total
      });

      if (!labScriptId) {
        console.error('No lab script ID found in session metadata:', session);
        throw new Error('No lab script ID found in session metadata');
      }

      // Update lab script payment status
      console.log('Updating lab script payment status for ID:', labScriptId);
      const { data: updateData, error: updateError } = await supabaseAdmin
        .from('lab_scripts')
        .update({ 
          payment_status: 'paid',
          status: 'completed'
        })
        .eq('id', labScriptId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating lab script:', updateError);
        throw updateError;
      }

      console.log('Successfully updated lab script:', updateData);

      // Fetch lab script details for invoice
      const { data: labScript, error: fetchError } = await supabaseAdmin
        .from('lab_scripts')
        .select(`
          *,
          patients (
            first_name,
            last_name,
            clinics (
              name,
              email,
              address,
              phone
            )
          )
        `)
        .eq('id', labScriptId)
        .single();

      if (fetchError || !labScript) {
        console.error('Error fetching lab script details:', fetchError);
        throw fetchError || new Error('Lab script not found');
      }

      console.log('Fetched lab script details:', labScript);

      try {
        // Create and process invoice
        console.log('Creating invoice for customer:', session.customer);
        const invoice = await stripe.invoices.create({
          customer: session.customer,
          auto_advance: true,
          collection_method: 'charge_automatically',
          metadata: {
            lab_script_id: labScriptId
          }
        });

        console.log('Created invoice:', invoice.id);

        // Add invoice items
        const invoiceItem = await stripe.invoiceItems.create({
          customer: session.customer,
          invoice: invoice.id,
          amount: session.amount_total,
          currency: session.currency,
          description: `Lab Script - ${labScript.appliance_type} (${labScript.arch})`,
        });

        console.log('Created invoice item:', invoiceItem.id);

        // Finalize and pay invoice
        const finalizedInvoice = await stripe.invoices.pay(invoice.id);
        console.log('Finalized and paid invoice:', finalizedInvoice.id);
      } catch (invoiceError) {
        console.error('Error handling invoice creation:', invoiceError);
        // Don't throw here - we still want to acknowledge the webhook
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});