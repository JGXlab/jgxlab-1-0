import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Log the Stripe key (masked)
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY') || '';
    console.log('Stripe key present:', !!stripeKey);
    
    // Parse the request body
    const { formData, totalAmount } = await req.json();
    console.log('Received request data:', { formData, totalAmount });

    if (!formData || !totalAmount) {
      throw new Error('Missing required data');
    }

    // Calculate amount in cents and ensure it's a valid number
    const amountInCents = Math.round(totalAmount * 100);
    if (isNaN(amountInCents) || amountInCents <= 0) {
      throw new Error('Invalid amount');
    }

    console.log('Creating checkout session with amount:', amountInCents);

    // Create a checkout session with minimal required fields
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Lab Script Service',
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('origin')}/clinic/submittedlabscripts?success=true`,
      cancel_url: `${req.headers.get('origin')}/clinic/submittedlabscripts?canceled=true`,
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