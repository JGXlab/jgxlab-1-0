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
    const { formData, lineItems, applianceType } = await req.json()
    console.log('Received request:', { formData, lineItems, applianceType })

    // Create a minimal version of formData for metadata
    const minimalMetadata = {
      patientId: formData.patientId,
      applianceType: formData.applianceType,
      arch: formData.arch,
      userId: formData.userId
    }

    // Convert to string and verify length
    const metadataStr = JSON.stringify(minimalMetadata)
    if (metadataStr.length > 500) {
      console.error('Metadata too long:', metadataStr.length)
      throw new Error('Metadata exceeds maximum length')
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/clinic/submittedlabscripts?payment_status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/clinic/submittedlabscripts?payment_status=failed`,
      allow_promotion_codes: true,
      metadata: {
        formData: metadataStr
      }
    })

    console.log('Created checkout session:', session)

    return new Response(
      JSON.stringify({ url: session.url }),
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