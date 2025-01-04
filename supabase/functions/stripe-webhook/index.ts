import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

serve(async (req) => {
  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!signature || !webhookSecret) {
      throw new Error('Missing stripe signature or webhook secret');
    }

    // Get the raw body as text
    const body = await req.text();
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error(`Webhook signature verification failed:`, err.message);
      return new Response(JSON.stringify({ error: err.message }), { status: 400 });
    }

    console.log('Received Stripe webhook event:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Initialize Supabase client
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        { auth: { persistSession: false } }
      );

      // Parse the form data from session metadata
      const formData = JSON.parse(session.metadata.formData);

      // Create the lab script after successful payment
      const { error: labScriptError } = await supabaseAdmin
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
        }]);

      if (labScriptError) {
        console.error('Error creating lab script:', labScriptError);
        throw labScriptError;
      }

      console.log('Successfully created lab script after payment');
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook handler failed' }), 
      { status: 500 }
    );
  }
});