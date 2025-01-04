import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@13.6.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    // Get the stripe signature from headers
    const stripeSignature = req.headers.get('stripe-signature');
    console.log('Received webhook request with signature:', stripeSignature);

    if (!stripeSignature) {
      console.error('No Stripe signature found in request headers');
      throw new Error('No Stripe signature found');
    }

    // Get the webhook secret from environment variables
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('Webhook secret not configured');
      throw new Error('Webhook secret not configured');
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Get the raw body as text for signature verification
    const rawBody = await req.text();
    console.log('Raw webhook body received:', rawBody);

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
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Supabase client
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

    // Handle the event
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
        console.error('No lab script ID found in session metadata');
        throw new Error('No lab script ID found in session metadata');
      }

      // Update lab script payment status
      console.log('Updating lab script payment status for ID:', labScriptId);
      const { data: updateData, error: updateError } = await supabaseAdmin
        .from('lab_scripts')
        .update({ 
          payment_status: 'paid',
          status: 'pending'  // Set to pending since it needs to be processed
        })
        .eq('id', labScriptId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating lab script:', updateError);
        throw updateError;
      }

      console.log('Successfully updated lab script:', updateData);
    }

    // Return a successful response
    return new Response(
      JSON.stringify({ received: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
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