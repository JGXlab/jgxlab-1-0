import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formData, totalAmount, applianceType } = await req.json();
    console.log('Received request data:', { formData, totalAmount, applianceType });

    // Validate required data
    if (!formData) {
      throw new Error('Form data is missing');
    }
    if (!totalAmount || isNaN(totalAmount)) {
      throw new Error('Invalid total amount');
    }
    if (!applianceType) {
      throw new Error('Appliance type is missing');
    }

    // Get Stripe price ID for the appliance type
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Fetching price for appliance type:', applianceType);
    const { data: priceData, error: priceError } = await supabase
      .from('service_prices')
      .select('stripe_price_id')
      .eq('service_name', applianceType.toLowerCase().replace(/ /g, '-'))
      .single();

    if (priceError || !priceData?.stripe_price_id) {
      console.error('Error fetching price ID:', priceError);
      throw new Error('Price not found for appliance type');
    }

    console.log('Found price ID:', priceData.stripe_price_id);

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    console.log('Creating checkout session...');
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceData.stripe_price_id,
          quantity: 1,
        },
      ],
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