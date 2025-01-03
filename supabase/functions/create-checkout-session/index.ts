import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    console.log('Received request:', { serviceId, totalAmount, formData });

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Get the stripe_product_id from service_prices table
    const { data: servicePrices, error: servicePriceError } = await supabaseClient
      .from('service_prices')
      .select('stripe_product_id')
      .eq('id', serviceId);

    console.log('Service price lookup result:', { servicePrices, servicePriceError });

    if (servicePriceError) {
      console.error('Service price lookup error:', servicePriceError);
      throw new Error(`Service price lookup failed: ${servicePriceError.message}`);
    }

    if (!servicePrices || servicePrices.length === 0) {
      console.error('No service price found for ID:', serviceId);
      throw new Error('No service price found');
    }

    const servicePrice = servicePrices[0];
    if (!servicePrice?.stripe_product_id) {
      console.error('No stripe_product_id found for service:', serviceId);
      throw new Error('No Stripe product ID found for this service');
    }

    const lineItems = [];

    // Add main service
    lineItems.push({
      price: servicePrice.stripe_product_id,
      quantity: formData.arch === 'dual' ? 2 : 1,
    });

    // Add nightguard if selected
    if (formData.needsNightguard === 'yes' && formData.applianceType !== 'surgical-day') {
      const { data: nightguardPrices } = await supabaseClient
        .from('service_prices')
        .select('stripe_product_id')
        .eq('service_name', 'nightguard');

      if (nightguardPrices && nightguardPrices.length > 0 && nightguardPrices[0]?.stripe_product_id) {
        lineItems.push({
          price: nightguardPrices[0].stripe_product_id,
          quantity: 1,
        });
      }
    }

    // Add express design if selected
    if (formData.expressDesign === 'yes' && formData.applianceType !== 'surgical-day') {
      const { data: expressPrices } = await supabaseClient
        .from('service_prices')
        .select('stripe_product_id')
        .eq('service_name', 'express_design');

      if (expressPrices && expressPrices.length > 0 && expressPrices[0]?.stripe_product_id) {
        lineItems.push({
          price: expressPrices[0].stripe_product_id,
          quantity: 1,
        });
      }
    }

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