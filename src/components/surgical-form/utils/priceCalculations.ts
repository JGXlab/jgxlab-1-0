export const NIGHTGUARD_PRICE = 50;
export const EXPRESS_DESIGN_PRICE = 50;

export const calculateTotalPrice = (basePrice: number, options: {
  archType: string;
  needsNightguard: string;
  expressDesign: string;
  applianceType: string;
}) => {
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