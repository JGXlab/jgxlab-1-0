import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import Stripe from 'https://esm.sh/stripe@13.6.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    })
  }

  try {
    const stripeSignature = req.headers.get('stripe-signature')
    if (!stripeSignature) {
      throw new Error('No Stripe signature found')
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    if (!webhookSecret) {
      throw new Error('Webhook secret not configured')
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Get the raw body
    const body = await req.text()
    console.log('Received webhook body:', body)

    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      stripeSignature,
      webhookSecret
    )

    console.log('Webhook event type:', event.type)

    // Initialize Supabase Admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const labScriptId = session.metadata?.lab_script_id

      if (!labScriptId) {
        throw new Error('No lab script ID found in session metadata')
      }

      console.log('Processing successful payment for lab script:', labScriptId)

      // Update lab script payment status
      const { error: updateError } = await supabaseAdmin
        .from('lab_scripts')
        .update({ payment_status: 'paid' })
        .eq('id', labScriptId)

      if (updateError) {
        console.error('Error updating lab script:', updateError)
        throw updateError
      }

      // Fetch lab script details for invoice
      const { data: labScript, error: fetchError } = await supabaseAdmin
        .from('lab_scripts')
        .select(`
          *,
          patients (
            first_name,
            last_name,
            clinics (
              name,
              email,
              address,
              phone
            )
          )
        `)
        .eq('id', labScriptId)
        .single()

      if (fetchError || !labScript) {
        console.error('Error fetching lab script details:', fetchError)
        throw fetchError || new Error('Lab script not found')
      }

      // Create invoice
      const invoice = await stripe.invoices.create({
        customer: session.customer,
        auto_advance: true, // Auto-finalize the draft
        collection_method: 'charge_automatically',
        metadata: {
          lab_script_id: labScriptId
        }
      })

      // Add invoice items
      await stripe.invoiceItems.create({
        customer: session.customer,
        invoice: invoice.id,
        amount: session.amount_total,
        currency: session.currency,
        description: `Lab Script - ${labScript.appliance_type} (${labScript.arch})`,
      })

      // Finalize and pay invoice
      await stripe.invoices.pay(invoice.id)

      console.log('Invoice created and paid:', invoice.id)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})