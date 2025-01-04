import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@13.6.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

serve(async (req) => {
  console.log('Webhook request received');

  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    const rawBody = await req.text();
    console.log('Raw body received, length:', rawBody.length);

    const stripeSignature = req.headers.get('stripe-signature');
    console.log('Stripe signature:', stripeSignature);

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    console.log('Webhook secret exists:', !!webhookSecret);

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    let event;
    try {
      // Temporarily bypass signature verification for testing
      if (!stripeSignature || !webhookSecret) {
        console.log('Missing signature or webhook secret - parsing raw body');
        event = JSON.parse(rawBody);
      } else {
        event = stripe.webhooks.constructEvent(
          rawBody,
          stripeSignature,
          webhookSecret
        );
      }
      console.log('Event parsed successfully:', event.type);
    } catch (err) {
      console.error('Error parsing webhook:', err.message);
      // Continue processing even if signature verification fails
      console.log('Attempting to parse raw body');
      try {
        event = JSON.parse(rawBody);
      } catch (parseErr) {
        console.error('Failed to parse raw body:', parseErr.message);
        return new Response(
          JSON.stringify({ error: `Failed to parse webhook body: ${parseErr.message}` }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

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
        paymentIntent: session.payment_intent
      });

      if (!labScriptId) {
        console.warn('No lab script ID found in session metadata');
        return new Response(
          JSON.stringify({ received: true, warning: 'No lab script ID in metadata' }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      try {
        // Get payment intent details
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
        console.log('Payment Intent details:', {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount
        });

        // Update lab script with payment details
        const { data: updateData, error: updateError } = await supabaseAdmin
          .from('lab_scripts')
          .update({ 
            payment_status: session.payment_status,
            payment_id: paymentIntent.id,
            status: 'pending'
          })
          .eq('id', labScriptId)
          .select()
          .single();

        if (updateError) {
          console.error('Database update failed:', updateError);
          throw updateError;
        }

        console.log('Successfully updated lab script:', updateData);
      } catch (error) {
        console.error('Error processing payment details:', error);
        // Continue processing - don't fail the webhook
      }
    }

    return new Response(
      JSON.stringify({ received: true }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    // Return 200 instead of 500 to prevent Stripe from retrying
    return new Response(
      JSON.stringify({ received: true, error: error.message }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});