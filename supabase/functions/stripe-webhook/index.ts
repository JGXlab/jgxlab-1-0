import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  try {
    console.log('Webhook received:', req.method);
    console.log('Headers:', Object.fromEntries(req.headers.entries()));
    console.log('Authorization header:', req.headers.get('authorization'));
    
    if (req.method === 'OPTIONS') {
      console.log('Handling CORS preflight request');
      return new Response(null, { 
        headers: {
          ...corsHeaders,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Max-Age': '86400',
        } 
      });
    }

    // Initialize Stripe with the secret key
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!signature || !webhookSecret) {
      console.error('Missing required headers:', {
        hasSignature: !!signature,
        hasWebhookSecret: !!webhookSecret,
      });
      return new Response(
        JSON.stringify({ error: 'Missing stripe signature or webhook secret' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const body = await req.text();
    console.log('Webhook body received, length:', body.length);
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('Event constructed successfully:', event.type);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return new Response(
        JSON.stringify({ error: err.message }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { 
        auth: { persistSession: false },
        global: { 
          headers: { 
            Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}` 
          } 
        }
      }
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('Processing successful checkout session:', session.id);
      
      try {
        if (!session.metadata?.formData) {
          throw new Error('No form data found in session metadata');
        }

        const formData = JSON.parse(session.metadata.formData);
        console.log('Parsed form data:', formData);

        // Update existing lab script instead of creating a new one
        const { data: labScript, error: updateError } = await supabaseAdmin
          .from('lab_scripts')
          .update({
            payment_status: 'paid',
            status: 'pending'
          })
          .eq('id', formData.labScriptId)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating lab script:', updateError);
          throw updateError;
        }

        console.log('Successfully updated lab script:', labScript);
        
        return new Response(
          JSON.stringify({ received: true, labScript }), 
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      } catch (error) {
        console.error('Error processing webhook:', error);
        return new Response(
          JSON.stringify({ error: error.message }), 
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }
    } else if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
      console.log('Payment failed or expired:', event.type);
      const session = event.data.object;
      
      try {
        if (session.metadata?.formData) {
          const formData = JSON.parse(session.metadata.formData);
          const { error: updateError } = await supabaseAdmin
            .from('lab_scripts')
            .update({ payment_status: 'failed' })
            .eq('id', formData.labScriptId);

          if (updateError) {
            console.error('Error updating lab script payment status:', updateError);
            throw updateError;
          }
          
          console.log('Successfully updated lab script payment status to failed');
        }

        return new Response(
          JSON.stringify({ received: true }), 
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      } catch (error) {
        console.error('Error handling failed payment:', error);
        return new Response(
          JSON.stringify({ error: error.message }), 
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          }
        );
      }
    }

    console.log('Unhandled event type:', event.type);
    return new Response(
      JSON.stringify({ received: true }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Webhook handler failed:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});