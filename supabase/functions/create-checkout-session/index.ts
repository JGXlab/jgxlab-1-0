import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formData, lineItems, applianceType } = await req.json();
    console.log('Received request data:', { formData, lineItems, applianceType });

    // Validate required data
    if (!formData) {
      throw new Error('Form data is missing');
    }
    if (!lineItems || !lineItems.length) {
      throw new Error('Line items are missing');
    }
    if (!applianceType) {
      throw new Error('Appliance type is missing');
    }

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Create a new lab script with pending payment status
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
        payment_status: 'pending',
        status: 'pending'
      }])
      .select()
      .single();

    if (labScriptError) {
      console.error('Error creating lab script:', labScriptError);
      throw new Error('Failed to create lab script');
    }

    console.log('Created lab script:', labScript);

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    console.log('Creating checkout session with line items:', lineItems);
    
    // Create Stripe checkout session with metadata for the lab script
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/clinic/submittedlabscripts?success=true&lab_script_id=${labScript.id}`,
      cancel_url: `${req.headers.get('origin')}/clinic/submittedlabscripts?canceled=true`,
      metadata: {
        lab_script_id: labScript.id
      }
    });

    console.log('Checkout session created:', session.id);
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in create-checkout-session:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});