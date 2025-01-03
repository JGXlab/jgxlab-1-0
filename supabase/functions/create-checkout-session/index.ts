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

    const { formData, serviceId } = await req.json();
    console.log('Received request with serviceId:', serviceId);
    console.log('Form data:', formData);

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Get the stripe_product_id from service_prices table
    const { data: servicePrice, error: servicePriceError } = await supabaseClient
      .from('service_prices')
      .select('stripe_product_id')
      .eq('id', serviceId)
      .single();

    console.log('Service price lookup result:', { servicePrice, servicePriceError });

    if (servicePriceError || !servicePrice?.stripe_product_id) {
      console.error('Service price not found:', servicePriceError);
      throw new Error('Service price not found');
    }

    const lineItems = [];

    // Add main service
    lineItems.push({
      price: servicePrice.stripe_product_id,
      quantity: formData.arch === 'dual' ? 2 : 1,
    });

    // Add nightguard if selected
    if (formData.needsNightguard === 'yes' && formData.applianceType !== 'surgical-day') {
      const { data: nightguardPrice } = await supabaseClient
        .from('service_prices')
        .select('stripe_product_id')
        .eq('service_name', 'nightguard')
        .single();

      if (nightguardPrice?.stripe_product_id) {
        lineItems.push({
          price: nightguardPrice.stripe_product_id,
          quantity: 1,
        });
      }
    }

    // Add express design if selected
    if (formData.expressDesign === 'yes' && formData.applianceType !== 'surgical-day') {
      const { data: expressPrice } = await supabaseClient
        .from('service_prices')
        .select('stripe_product_id')
        .eq('service_name', 'express_design')
        .single();

      if (expressPrice?.stripe_product_id) {
        lineItems.push({
          price: expressPrice.stripe_product_id,
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
    console.error('Error creating payment session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});