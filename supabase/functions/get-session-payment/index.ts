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
      expand: ['payment_intent', 'invoice', 'total_details']
    })

    console.log('Retrieved session:', session)

    // Consider the payment successful if it's either paid or the total is 0
    if (session.payment_status === 'paid' || session.amount_total === 0) {
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
            status: 'paid',
            paymentId: session.payment_intent?.id || null,
            amount_total: session.amount_total || 0,
            invoiceUrl: session.invoice?.invoice_pdf || null
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Get metadata from session
      const metadata = session.metadata
      console.log('Session metadata:', metadata)

      if (!metadata || !metadata.patientId || !metadata.applianceType || !metadata.arch || !metadata.userId) {
        throw new Error('Missing required metadata')
      }

      // Get discount information
      const discountAmount = session.total_details?.amount_discount || 0
      const promoCode = session.total_details?.breakdown?.discounts?.[0]?.discount?.promotion_code?.code

      // Create the lab script after successful payment
      const { data: labScript, error: labScriptError } = await supabaseAdmin
        .from('lab_scripts')
        .insert([{
          patient_id: metadata.patientId,
          appliance_type: metadata.applianceType,
          arch: metadata.arch,
          user_id: metadata.userId,
          payment_status: 'paid',
          payment_id: session.payment_intent?.id || `free_${sessionId}`,
          amount_paid: session.amount_total ? session.amount_total / 100 : 0,
          payment_date: new Date().toISOString()
        }])
        .select()
        .single()

      if (labScriptError) {
        console.error('Error creating lab script:', labScriptError)
        throw labScriptError
      }

      console.log('Created lab script after payment:', labScript)

      // Get clinic details
      const { data: clinic, error: clinicError } = await supabaseAdmin
        .from('clinics')
        .select('*')
        .eq('user_id', metadata.userId)
        .single()

      if (clinicError) {
        console.error('Error fetching clinic:', clinicError)
        throw clinicError
      }

      // Get patient details
      const { data: patient, error: patientError } = await supabaseAdmin
        .from('patients')
        .select('*')
        .eq('id', metadata.patientId)
        .single()

      if (patientError) {
        console.error('Error fetching patient:', patientError)
        throw patientError
      }

      // Create invoice record with discount information
      const { error: invoiceError } = await supabaseAdmin
        .from('invoices')
        .insert([{
          lab_script_id: labScript.id,
          clinic_name: clinic.name,
          clinic_email: clinic.email,
          clinic_phone: clinic.phone,
          clinic_address: clinic.address,
          patient_name: `${patient.first_name} ${patient.last_name}`,
          appliance_type: metadata.applianceType,
          arch: metadata.arch,
          amount_paid: session.amount_total ? session.amount_total / 100 : 0,
          payment_id: session.payment_intent?.id || `free_${sessionId}`,
          discount_amount: discountAmount ? discountAmount / 100 : 0,
          promo_code: promoCode || null
        }])

      if (invoiceError) {
        console.error('Error creating invoice:', invoiceError)
        throw invoiceError
      }

      console.log('Created invoice for lab script:', labScript.id)
    }

    return new Response(
      JSON.stringify({ 
        status: session.payment_status,
        paymentId: session.payment_intent?.id || `free_${sessionId}`,
        amount_total: session.amount_total || 0,
        invoiceUrl: session.invoice?.invoice_pdf || null,
        discountAmount: session.total_details?.amount_discount ? session.total_details.amount_discount / 100 : 0,
        promoCode: session.total_details?.breakdown?.discounts?.[0]?.discount?.promotion_code?.code
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