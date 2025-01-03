import { NIGHTGUARD_PRICE, EXPRESS_DESIGN_PRICE } from "./utils/priceCalculations";

interface PriceBreakdownProps {
  basePrice: number;
  archType: string;
  needsNightguard: string;
  expressDesign: string;
  applianceType: string;
  formattedApplianceType: string;
}

export const PriceBreakdown = ({
  basePrice,
  archType,
  needsNightguard,
  expressDesign,
  applianceType,
  formattedApplianceType,
}: PriceBreakdownProps) => {
  const isDual = archType === 'dual';
  const hasNightguard = needsNightguard === 'yes' && applianceType !== 'surgical-day';
  const hasExpressDesign = expressDesign === 'yes' && applianceType !== 'surgical-day';
  const quantity = isDual ? 2 : 1;
  const baseTotal = basePrice * quantity;

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Price Breakdown:</div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <span>{formattedApplianceType}</span>
            <span className="text-gray-500 ml-2">x{quantity}</span>
          </div>
          <span>${baseTotal.toFixed(2)}</span>
        </div>
        {hasNightguard && (
          <div className="flex justify-between">
            <span>Nightguard</span>
            <span>+${NIGHTGUARD_PRICE.toFixed(2)}</span>
          </div>
        )}
        {hasExpressDesign && (
          <div className="flex justify-between">
            <span>Express Design</span>
            <span>+${EXPRESS_DESIGN_PRICE.toFixed(2)}</span>
          </div>
        )}
        <div className="pt-2 border-t flex justify-between font-semibold">
          <span>Total:</span>
          <span>${(baseTotal + 
            (hasNightguard ? NIGHTGUARD_PRICE : 0) + 
            (hasExpressDesign ? EXPRESS_DESIGN_PRICE : 0)
          ).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};