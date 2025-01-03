import { supabase } from "@/integrations/supabase/client";

export const NIGHTGUARD_PRICE = 50;
export const EXPRESS_DESIGN_PRICE = 50;

export const fetchPriceForService = async (applianceType: string) => {
  const { data, error } = await supabase
    .from('service_prices')
    .select('price')
    .eq('service_name', applianceType)
    .single();

  if (error) {
    console.error('Error fetching price:', error);
    return null;
  }

  return data?.price;
};

export const fetchAddonPrice = async (addonType: string) => {
  const { data, error } = await supabase
    .from('service_prices')
    .select('price')
    .eq('addon_type', addonType)
    .eq('is_addon', true)
    .single();

  if (error) {
    console.error('Error fetching addon price:', error);
    return null;
  }

  return data?.price;
};

export const calculateTotalPrice = async (basePrice: number, options: {
  archType: string;
  needsNightguard: string;
  expressDesign: string;
  applianceType: string;
}) => {
  const { archType, needsNightguard, expressDesign, applianceType } = options;
  let totalPrice = basePrice;

  try {
    // Fetch real-time prices from service_prices table
    const servicePriceResult = await fetchPriceForService(applianceType);
    if (servicePriceResult !== null) {
      totalPrice = servicePriceResult;
    }

    // Double the price for dual arch
    if (archType === 'dual') {
      totalPrice *= 2;
    }

    // Add nightguard price if selected (not for surgical-day)
    if (needsNightguard === 'yes' && applianceType !== 'surgical-day') {
      const nightguardPrice = await fetchAddonPrice('nightguard') ?? NIGHTGUARD_PRICE;
      totalPrice += nightguardPrice;
    }

    // Add express design price if selected (not for surgical-day)
    if (expressDesign === 'yes' && applianceType !== 'surgical-day') {
      const expressPrice = await fetchAddonPrice('express') ?? EXPRESS_DESIGN_PRICE;
      totalPrice += expressPrice;
    }

    return totalPrice;
  } catch (error) {
    console.error('Error calculating total price:', error);
    return basePrice; // Fallback to base price if there's an error
  }
};