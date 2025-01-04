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

  if (req.method !== 'POST') {
    console.error(`Invalid method: ${req.method}`);
    return new Response('Method not allowed', {
      status: 405,
      headers: corsHeaders
    });
  }

  try {
    const rawBody = await req.text();
    console.log('Raw body received, length:', rawBody.length);

    const stripeSignature = req.headers.get('stripe-signature');
    console.log('Stripe signature:', stripeSignature ? 'Present' : 'Missing');

    if (!stripeSignature) {
      throw new Error('No stripe signature found in request headers');
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('Webhook secret not configured in environment');
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        stripeSignature,
        webhookSecret
      );
      console.log('Webhook signature verified successfully');
      console.log('Event type:', event.type);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return new Response(
        JSON.stringify({ error: `Webhook signature verification failed: ${err.message}` }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
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
        throw new Error('No lab script ID found in session metadata');
      }

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
        throw new Error(`Database update failed: ${updateError.message}`);
      }

      console.log('Successfully updated lab script:', updateData);
    }

    return new Response(
      JSON.stringify({ received: true }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error processing webhook:', error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});