import { supabase } from "@/integrations/supabase/client";

export const NIGHTGUARD_PRICE = 50;
export const EXPRESS_DESIGN_PRICE = 50;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchStripePrice = async (priceId: string, retries = 3): Promise<number> => {
  if (!priceId) {
    console.log('No price ID provided');
    return 0;
  }
  
  console.log('Fetching Stripe price for ID:', priceId);
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const { data, error } = await supabase.functions.invoke('get-stripe-price', {
        body: { priceId }
      });

      if (error) {
        console.error('Error fetching Stripe price:', error);
        
        // If it's a rate limit error, wait before retrying
        if (error.status === 429) {
          const retryAfter = parseInt(error.retryAfter) || 5;
          console.log(`Rate limited. Waiting ${retryAfter} seconds before retry...`);
          await delay(retryAfter * 1000);
          continue;
        }
        
        throw error;
      }

      console.log('Price data received:', data);
      return data.price || 0;
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt === retries) throw error;
      await delay(1000 * attempt); // Exponential backoff
    }
  }

  return 0;
};

export const calculateTotalPrice = async (basePrice: number, options: {
  archType: string;
  needsNightguard: string;
  expressDesign: string;
  applianceType: string;
}): Promise<{ total: number; lineItems: Array<{ price: string; quantity: number }> }> => {
  const { archType, needsNightguard, expressDesign, applianceType } = options;
  const lineItems: Array<{ price: string; quantity: number }> = [];

  console.log('Calculating price for:', { applianceType, archType, needsNightguard, expressDesign });

  if (!applianceType) {
    console.log('No appliance type provided');
    return { total: 0, lineItems: [] };
  }

  // Get base price Stripe ID
  const { data: baseProduct, error: baseError } = await supabase
    .from('service_prices')
    .select('stripe_price_id')
    .eq('service_name', applianceType)
    .maybeSingle();

  if (baseError) {
    console.error('Error fetching base price:', baseError);
    return { total: 0, lineItems: [] };
  }

  let totalPrice = 0;
  
  if (baseProduct?.stripe_price_id) {
    const price = await fetchStripePrice(baseProduct.stripe_price_id);
    totalPrice = price;
    lineItems.push({
      price: baseProduct.stripe_price_id,
      quantity: archType === 'dual' ? 2 : 1
    });
  }

  // Add nightguard if selected (not for surgical-day)
  if (needsNightguard === 'yes' && applianceType !== 'surgical-day') {
    const { data: nightguardPrice, error: nightguardError } = await supabase
      .from('service_prices')
      .select('stripe_price_id')
      .eq('service_name', 'additional-nightguard')
      .maybeSingle();
    
    if (nightguardError) {
      console.error('Error fetching nightguard price:', nightguardError);
    } else if (nightguardPrice?.stripe_price_id) {
      const price = await fetchStripePrice(nightguardPrice.stripe_price_id);
      totalPrice += price;
      lineItems.push({
        price: nightguardPrice.stripe_price_id,
        quantity: 1
      });
    }
  }

  // Add express design if selected (not for surgical-day)
  if (expressDesign === 'yes' && applianceType !== 'surgical-day') {
    const { data: expressPrice, error: expressError } = await supabase
      .from('service_prices')
      .select('stripe_price_id')
      .eq('service_name', 'express-design')
      .maybeSingle();
    
    if (expressError) {
      console.error('Error fetching express design price:', expressError);
    } else if (expressPrice?.stripe_price_id) {
      const price = await fetchStripePrice(expressPrice.stripe_price_id);
      totalPrice += price;
      lineItems.push({
        price: expressPrice.stripe_price_id,
        quantity: 1
      });
    }
  }

  // Apply quantity for dual arch
  if (archType === 'dual') {
    totalPrice *= 2;
  }

  console.log('Price calculation complete:', {
    totalPrice,
    lineItems,
    options
  });

  return {
    total: totalPrice,
    lineItems
  };
};

export const fetchPriceForService = async (serviceName: string): Promise<number> => {
  if (!serviceName) {
    console.log('No service name provided');
    return 0;
  }

  console.log('Fetching price for service:', serviceName);

  const { data, error } = await supabase
    .from('service_prices')
    .select('stripe_price_id')
    .eq('service_name', serviceName)
    .maybeSingle();

  if (error) {
    console.error('Error fetching price:', error);
    return 0;
  }

  if (!data?.stripe_price_id) {
    console.error('No Stripe price ID found for service:', serviceName);
    return 0;
  }

  return fetchStripePrice(data.stripe_price_id);
};
