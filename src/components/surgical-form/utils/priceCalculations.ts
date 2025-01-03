import { supabase } from "@/integrations/supabase/client";

export const NIGHTGUARD_PRICE = 50;
export const EXPRESS_DESIGN_PRICE = 50;

export const calculateTotalPrice = (basePrice: number, options: {
  archType: string;
  needsNightguard: string;
  expressDesign: string;
  applianceType: string;
}): number => {
  const { archType, needsNightguard, expressDesign, applianceType } = options;
  let totalPrice = basePrice;

  // Double the price for dual arch
  if (archType === 'dual') {
    totalPrice *= 2;
  }

  // Add nightguard price if selected (not for surgical-day)
  if (needsNightguard === 'yes' && applianceType !== 'surgical-day') {
    totalPrice += NIGHTGUARD_PRICE;
  }

  // Add express design price if selected (not for surgical-day)
  if (expressDesign === 'yes' && applianceType !== 'surgical-day') {
    totalPrice += EXPRESS_DESIGN_PRICE;
  }

  return totalPrice;
};

export const fetchPriceForService = async (serviceName: string): Promise<number> => {
  if (!serviceName) return 0;

  console.log('Fetching price for service:', serviceName);

  const { data, error } = await supabase
    .from('service_prices')
    .select('price')
    .eq('service_name', serviceName)
    .maybeSingle();

  if (error) {
    console.error('Error fetching price:', error);
    return 0;
  }

  console.log('Price data:', data);
  return data?.price ?? 0;
};