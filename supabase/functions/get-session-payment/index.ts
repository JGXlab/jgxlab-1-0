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

      // Create lab script only after successful payment
      const { data: labScript, error: labScriptError } = await supabaseAdmin
        .from('lab_scripts')
        .insert([{
          patient_id: session.metadata.patient_id,
          appliance_type: session.metadata.appliance_type,
          arch: session.metadata.arch,
          treatment_type: session.metadata.treatment_type,
          screw_type: session.metadata.screw_type,
          other_screw_type: session.metadata.other_screw_type,
          vdo_details: session.metadata.vdo_details,
          needs_nightguard: session.metadata.needs_nightguard,
          shade: session.metadata.shade,
          due_date: session.metadata.due_date,
          specific_instructions: session.metadata.specific_instructions,
          express_design: session.metadata.express_design,
          user_id: session.metadata.user_id,
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

      return new Response(
        JSON.stringify({ 
          status: session.payment_status,
          paymentId: session.payment_intent?.id || null,
          amount_total: session.amount_total || 0,
          invoiceUrl: session.invoice?.invoice_pdf || null,
          labScriptId: labScript.id
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    return new Response(
      JSON.stringify({ 
        status: session.payment_status,
        paymentId: session.payment_intent?.id || null,
        amount_total: session.amount_total || 0,
        invoiceUrl: session.invoice?.invoice_pdf || null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})