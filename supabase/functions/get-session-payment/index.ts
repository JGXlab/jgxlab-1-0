import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@13.6.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { sessionId } = await req.json()
    console.log('Processing session:', sessionId)

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'invoice']
    })

    console.log('Retrieved session:', session)

    if (session.payment_status === 'paid') {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')
      const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
      
      if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error('Missing Supabase configuration')
      }

      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

      // Check if a lab script with this payment_id already exists
      const { data: existingLabScript } = await supabaseAdmin
        .from('lab_scripts')
        .select('id')
        .eq('payment_id', session.payment_intent?.id)
        .single()

      if (existingLabScript) {
        console.log('Lab script already exists for this payment:', existingLabScript.id)
        return new Response(
          JSON.stringify({ 
            status: session.payment_status,
            paymentId: session.payment_intent?.id || null,
            amount_total: session.amount_total || 0,
            invoiceUrl: session.invoice?.invoice_pdf || null
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Parse the form data from session metadata
      const formData = JSON.parse(session.metadata.formData)

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
          payment_id: session.payment_intent?.id,
          amount_paid: session.amount_total ? session.amount_total / 100 : null,
          payment_date: new Date().toISOString()
        }])
        .select()
        .single()

      if (labScriptError) {
        console.error('Error creating lab script:', labScriptError)
        throw labScriptError
      }

      console.log('Created lab script after payment:', labScript)
    }

    return new Response(
      JSON.stringify({ 
        status: session.payment_status,
        paymentId: session.payment_intent?.id || null,
        amount_total: session.amount_total || 0,
        invoiceUrl: session.invoice?.invoice_pdf || null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})