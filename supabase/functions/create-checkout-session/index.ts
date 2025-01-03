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

    const { formData, serviceId } = await req.json();
    console.log('Received request with serviceId:', serviceId);
    console.log('Form data:', formData);

    if (!serviceId) {
      throw new Error('No serviceId provided');
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // First, let's log all service prices to debug
    const { data: allPrices, error: allPricesError } = await supabaseClient
      .from('service_prices')
      .select('*');
    
    console.log('All available service prices:', allPrices);
    
    if (allPricesError) {
      console.error('Error fetching all prices:', allPricesError);
    }

    // Get the specific service price
    const { data: servicePrices, error: servicePriceError } = await supabaseClient
      .from('service_prices')
      .select('*')
      .eq('id', serviceId)
      .single();

    console.log('Service price lookup result:', { servicePrices, servicePriceError });

    if (servicePriceError) {
      console.error('Service price lookup error:', servicePriceError);
      throw new Error(`Service price lookup failed: ${servicePriceError.message}`);
    }

    if (!servicePrices) {
      console.error('No service price found for ID:', serviceId);
      throw new Error('No service price found');
    }

    console.log('Found service price:', servicePrices);

    // Calculate the unit amount (in cents)
    let unitAmount = Math.round(Number(servicePrices.price) * 100);
    console.log('Base unit amount:', unitAmount);

    // Create line items array
    const lineItems = [];

    // Add main service with correct quantity for dual arch
    lineItems.push({
      price_data: {
        currency: 'usd',
        product_data: {
          name: servicePrices.service_name,
        },
        unit_amount: unitAmount,
      },
      quantity: formData.arch === 'dual' ? 2 : 1,
    });

    // Add nightguard if selected (not for surgical-day)
    if (formData.needsNightguard === 'yes' && formData.applianceType !== 'surgical-day') {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Nightguard',
          },
          unit_amount: NIGHTGUARD_PRICE * 100,
        },
        quantity: 1,
      });
    }

    // Add express design if selected (not for surgical-day)
    if (formData.expressDesign === 'yes' && formData.applianceType !== 'surgical-day') {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Express Design (24h)',
          },
          unit_amount: EXPRESS_DESIGN_PRICE * 100,
        },
        quantity: 1,
      });
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