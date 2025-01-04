import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

serve(async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const labScriptId = searchParams.get('labScriptId');

    if (!labScriptId) {
      return new Response(
        JSON.stringify({ error: 'Lab script ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the payment intent from the checkout session
    const sessions = await stripe.checkout.sessions.list({
      limit: 1,
      expand: ['data.payment_intent', 'data.invoice'],
      metadata: { lab_script_id: labScriptId },
    });

    const session = sessions.data[0];
    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Payment session not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        payment_intent: session.payment_intent?.id,
        amount_total: session.amount_total,
        created: session.created,
        invoice_url: session.invoice?.invoice_pdf,
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
})