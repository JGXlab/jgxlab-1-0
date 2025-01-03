import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const CACHE_DURATION = 3600; // Cache for 1 hour in seconds

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { priceId } = await req.json();
    console.log('Fetching price for:', priceId);

    if (!priceId) {
      throw new Error('Price ID is required');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // First, try to get price from service_prices table
    const { data: priceData, error: dbError } = await supabase
      .from('service_prices')
      .select('price, stripe_price_id')
      .eq('stripe_price_id', priceId)
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
    }

    if (priceData?.price) {
      console.log('Using cached price from database:', priceData.price);
      return new Response(
        JSON.stringify({ 
          price: priceData.price,
          source: 'database'
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
          status: 200,
        }
      );
    }

    // If not in database or price is null, fetch from Stripe
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('Stripe secret key not configured');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    const price = await stripe.prices.retrieve(priceId);
    console.log('Retrieved price from Stripe:', price);

    // Update the price in the database for future use
    if (price.unit_amount) {
      const { error: updateError } = await supabase
        .from('service_prices')
        .update({ 
          price: price.unit_amount / 100,
          updated_at: new Date().toISOString()
        })
        .eq('stripe_price_id', priceId);

      if (updateError) {
        console.error('Error updating price in database:', updateError);
      }
    }

    return new Response(
      JSON.stringify({ 
        price: price.unit_amount ? price.unit_amount / 100 : 0,
        currency: price.currency,
        source: 'stripe'
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error fetching Stripe price:', error);
    
    // Check if it's a rate limit error
    if (error.message?.includes('rate limit')) {
      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Please try again in a few seconds.',
          retryAfter: 5 // Suggest retry after 5 seconds
        }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Retry-After': '5'
          },
          status: 429,
        }
      );
    }

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      }
    );
  }
});