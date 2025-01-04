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
    
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      console.log('Handling CORS preflight request');
      return new Response(null, { headers: corsHeaders });
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    console.log('Webhook headers:', {
      signature: signature ? 'Present' : 'Missing',
      webhookSecret: webhookSecret ? 'Present' : 'Missing'
    });

    if (!signature || !webhookSecret) {
      console.error('Missing required headers:', { signature: !!signature, webhookSecret: !!webhookSecret });
      throw new Error('Missing stripe signature or webhook secret');
    }

    // Get the raw body as text
    const body = await req.text();
    console.log('Received webhook body length:', body.length);
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error(`⚠️ Webhook signature verification failed:`, err.message);
      return new Response(JSON.stringify({ error: err.message }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Webhook event type:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('Processing completed checkout session:', session.id);
      
      // Initialize Supabase client
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        { auth: { persistSession: false } }
      );

      try {
        // Parse the form data from session metadata
        console.log('Session metadata:', session.metadata);
        if (!session.metadata?.formData) {
          throw new Error('No form data found in session metadata');
        }

        const formData = JSON.parse(session.metadata.formData);
        console.log('Parsed form data:', formData);

        // Create the lab script after successful payment
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
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      } catch (error) {
        console.error('Error processing webhook data:', error);
        return new Response(
          JSON.stringify({ 
            error: 'Error processing webhook data',
            details: error.message,
            stack: error.stack
          }), 
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ received: true }), 
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Webhook handler failed:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Webhook handler failed', 
        details: error.message,
        stack: error.stack 
      }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});