import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formData, lineItems, applianceType } = await req.json();
    console.log('Received request data:', { formData, lineItems, applianceType });

    // Validate required data
    if (!formData) {
      throw new Error('Form data is missing');
    }
    if (!lineItems || !lineItems.length) {
      throw new Error('Line items are missing');
    }
    if (!applianceType) {
      throw new Error('Appliance type is missing');
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get the price IDs from the service_prices table
    const { data: servicePrices, error: pricesError } = await supabaseClient
      .from('service_prices')
      .select('service_name, stripe_price_id')
      .in('service_name', lineItems.map(item => item.service_name));

    if (pricesError) {
      console.error('Error fetching service prices:', pricesError);
      throw new Error('Failed to fetch service prices');
    }

    // Map the line items to use the correct price IDs from the database
    const stripeLineItems = lineItems.map(item => {
      const servicePrice = servicePrices.find(sp => sp.service_name === item.service_name);
      if (!servicePrice?.stripe_price_id) {
        throw new Error(`No price ID found for service: ${item.service_name}`);
      }
      return {
        price: servicePrice.stripe_price_id,
        quantity: item.quantity,
      };
    });

    console.log('Creating checkout session with line items:', stripeLineItems);
    
    const session = await stripe.checkout.sessions.create({
      line_items: stripeLineItems,
      mode: 'payment',
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