import { supabase } from "@/integrations/supabase/client";

export const NIGHTGUARD_PRICE = 50;
export const EXPRESS_DESIGN_PRICE = 50;

const fetchStripePrice = async (priceId: string): Promise<number> => {
  if (!priceId) return 0;
  
  const { data, error } = await supabase.functions.invoke('get-stripe-price', {
    body: { priceId }
  });

  if (error) {
    console.error('Error fetching Stripe price:', error);
    return 0;
  }

  return data.price || 0;
};

export const calculateTotalPrice = async (basePrice: number, options: {
  archType: string;
  needsNightguard: string;
  expressDesign: string;
  applianceType: string;
}): Promise<{ total: number; lineItems: Array<{ price: string; quantity: number }> }> => {
  const { archType, needsNightguard, expressDesign, applianceType } = options;
  const lineItems: Array<{ price: string; quantity: number }> = [];

  // Get base price Stripe ID
  const { data: baseProduct } = await supabase
    .from('service_prices')
    .select('stripe_price_id')
    .eq('service_name', applianceType)
    .single();

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
    const { data: nightguardPrice } = await supabase
      .from('service_prices')
      .select('stripe_price_id')
      .eq('service_name', 'additional-nightguard')
      .single();
    
    if (nightguardPrice?.stripe_price_id) {
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
    const { data: expressPrice } = await supabase
      .from('service_prices')
      .select('stripe_price_id')
      .eq('service_name', 'express-design')
      .single();
    
    if (expressPrice?.stripe_price_id) {
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
  if (!serviceName) return 0;

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