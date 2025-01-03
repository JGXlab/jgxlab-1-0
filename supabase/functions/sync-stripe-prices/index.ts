import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    console.log('Fetching Stripe products and prices...');
    
    // Fetch all active products with their prices
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log(`Processing ${products.data.length} products...`);

    // Update service_prices table
    for (const product of products.data) {
      const price = product.default_price as Stripe.Price;
      if (!price) {
        console.log(`Skipping product ${product.id} - no default price`);
        continue;
      }

      console.log(`Updating price for product: ${product.name}`);

      const { error } = await supabase
        .from('service_prices')
        .upsert({
          service_name: product.name.toLowerCase().replace(/ /g, '-'),
          price: price.unit_amount ? price.unit_amount / 100 : 0,
          stripe_product_id: product.id,
          stripe_price_id: price.id,
          is_addon: product.metadata.is_addon === 'true',
          addon_type: product.metadata.addon_type,
        }, {
          onConflict: 'stripe_product_id'
        });

      if (error) {
        console.error('Error updating price for product:', product.id, error);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Prices synced successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error syncing prices:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});