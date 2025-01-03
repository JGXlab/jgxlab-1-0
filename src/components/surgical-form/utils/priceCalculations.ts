import { supabase } from "@/integrations/supabase/client";

export const NIGHTGUARD_PRICE = 50;
export const EXPRESS_DESIGN_PRICE = 50;

const fetchStripePrice = async (priceId: string): Promise<number> => {
  if (!priceId) {
    console.log('No price ID provided');
    return 0;
  }
  
  console.log('Fetching Stripe price for ID:', priceId);
  const { data, error } = await supabase.functions.invoke('get-stripe-price', {
    body: { priceId }
  });

  if (error) {
    console.error('Error fetching Stripe price:', error);
    return 0;
  }

  return data.price || 0;
};

export const calculateTotalAmount = ({
  basePrice,
  applianceType,
  archType,
  needsNightguard,
  expressDesign,
}: {
  basePrice: number;
  applianceType: string;
  archType: string;
  needsNightguard: string;
  expressDesign: string;
}): number => {
  let total = basePrice;

  // Double the price for dual arch
  if (archType === 'dual') {
    total *= 2;
  }

  // Add nightguard price if selected (not for surgical-day)
  if (needsNightguard === 'yes' && applianceType !== 'surgical-day') {
    total += NIGHTGUARD_PRICE;
  }

  // Add express design price if selected (not for surgical-day)
  if (expressDesign === 'yes' && applianceType !== 'surgical-day') {
    total += EXPRESS_DESIGN_PRICE;
  }

  return total;
};

export const formatApplianceType = (applianceType: string): string => {
  switch (applianceType) {
    case 'surgical-day':
      return 'Surgical Day Appliance';
    case 'implant-detection':
      return 'Implant Detection (IDID)';
    case 'further-revision':
      return 'Further Revision (PTIs)';
    case 'final-dlz':
      return 'Final DLZ (Zi / PMMA)';
    case 'final-ti-bar':
      return 'Final Ti-bar & SS';
    case 'ti-bar-design':
      return 'Ti-Bar Design';
    default:
      return applianceType;
  }
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