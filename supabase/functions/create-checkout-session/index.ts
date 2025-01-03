import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const NIGHTGUARD_PRICE = 50;
const EXPRESS_DESIGN_PRICE = 50;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
  );

  try {
    // Get the session or user object
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);

    if (!user?.email) {
      throw new Error('No email found');
    }

    const { formData, serviceId, totalAmount } = await req.json();
    console.log('Received request:', { formData, serviceId, totalAmount });

    if (!serviceId) {
      throw new Error('No serviceId provided');
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Get the specific service price with better error handling
    const { data: servicePrice, error: servicePriceError } = await supabaseClient
      .from('service_prices')
      .select('*')
      .eq('id', serviceId)
      .single();

    console.log('Service price lookup result:', { servicePrice, servicePriceError });

    if (servicePriceError) {
      console.error('Service price error:', servicePriceError);
      throw new Error(`Service price lookup failed: ${servicePriceError.message}`);
    }

    if (!servicePrice) {
      console.error('No service price found for ID:', serviceId);
      throw new Error(`No service price found for ID: ${serviceId}`);
    }

    // Calculate total amount in cents for Stripe
    const finalAmount = Math.round(totalAmount * 100);
    console.log('Final amount in cents:', finalAmount);

    // Create line items array with the main service
    const lineItems = [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${servicePrice.service_name} - ${formData.arch.toUpperCase()} Arch`,
          description: `Lab script for ${formData.applianceType.split('-').join(' ')}`
        },
        unit_amount: finalAmount,
      },
      quantity: 1,
    }];

    console.log('Creating checkout session with line items:', lineItems);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/clinic/submittedlabscripts?session_id={CHECKOUT_SESSION_ID}&success=true`,
      cancel_url: `${req.headers.get('origin')}/clinic/submittedlabscripts?canceled=true`,
      metadata: {
        formData: JSON.stringify(formData),
        userId: user.id,
      },
    });

    console.log('Payment session created:', session.id);
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