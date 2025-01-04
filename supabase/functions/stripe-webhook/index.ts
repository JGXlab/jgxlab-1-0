import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  try {
    console.log('Webhook received:', req.method);
    
    if (req.method === 'OPTIONS') {
      console.log('Handling CORS preflight request');
      return new Response(null, { headers: corsHeaders });
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    console.log('Webhook verification details:', {
      hasSignature: !!signature,
      hasWebhookSecret: !!webhookSecret,
    });

    if (!signature || !webhookSecret) {
      console.error('Missing required headers');
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

    console.log('Processing webhook event:', event.type);

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
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

        const { data: labScript, error: labScriptError } = await supabaseAdmin
          .from('lab_scripts')
          .insert([{
            patient_id: formData.patientId,
            appliance_type: formData.applianceType,
            arch: formData.arch,
            treatment_type: formData.treatmentType,
            screw_type: formData.screwType,
            other_screw_type: formData.otherScrewType,
            vdo_details: formData.vdoDetails,
            needs_nightguard: formData.needsNightguard,
            shade: formData.shade,
            due_date: formData.dueDate,
            specific_instructions: formData.specificInstructions,
            express_design: formData.expressDesign,
            user_id: formData.userId,
            payment_status: 'paid',
            status: 'pending'
          }])
          .select()
          .single();

        if (labScriptError) {
          console.error('Error creating lab script:', labScriptError);
          throw labScriptError;
        }

        console.log('Successfully created lab script:', labScript);
        
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
      // Handle failed payment
      console.log('Payment failed or expired:', event.type);
      const session = event.data.object;
      
      try {
        if (session.metadata?.formData) {
          const formData = JSON.parse(session.metadata.formData);
          // Update the lab script status to failed if it exists
          const { error: updateError } = await supabaseAdmin
            .from('lab_scripts')
            .update({ payment_status: 'failed' })
            .eq('id', formData.labScriptId);

          if (updateError) {
            console.error('Error updating lab script payment status:', updateError);
            throw updateError;
          }
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

    // Handle other event types
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