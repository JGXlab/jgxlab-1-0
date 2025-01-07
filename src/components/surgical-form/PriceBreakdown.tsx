import { useQuery } from "@tanstack/react-query";
import { fetchPriceForService } from "./utils/priceCalculations";

interface PriceBreakdownProps {
  basePrice: number;
  archType: string;
  needsNightguard: string;
  expressDesign: string;
  applianceType: string;
  formattedApplianceType: string;
  isFreeTrialEligible?: boolean;
}

export const PriceBreakdown = ({
  archType,
  needsNightguard,
  expressDesign,
  applianceType,
  formattedApplianceType,
  isFreeTrialEligible = false,
}: PriceBreakdownProps) => {
  const isDual = archType === 'dual';
  const hasNightguard = needsNightguard === 'yes' && applianceType !== 'surgical-day';
  const hasExpressDesign = expressDesign === 'yes' && applianceType !== 'surgical-day';
  const quantity = isDual ? 2 : 1;

  const { data: basePrice = 0, isLoading: isLoadingBase } = useQuery({
    queryKey: ['price', applianceType],
    queryFn: () => fetchPriceForService(applianceType),
    enabled: !!applianceType,
  });

  const { data: nightguardPrice = 0, isLoading: isLoadingNightguard } = useQuery({
    queryKey: ['price', 'additional-nightguard'],
    queryFn: () => fetchPriceForService('additional-nightguard'),
    enabled: hasNightguard,
  });

  const { data: expressPrice = 0, isLoading: isLoadingExpress } = useQuery({
    queryKey: ['price', 'express-design'],
    queryFn: () => fetchPriceForService('express-design'),
    enabled: hasExpressDesign,
  });

  const isLoading = isLoadingBase || (hasNightguard && isLoadingNightguard) || (hasExpressDesign && isLoadingExpress);
  const baseTotal = isFreeTrialEligible ? 0 : basePrice * quantity;
  const total = baseTotal + (hasNightguard ? nightguardPrice : 0) + (hasExpressDesign ? expressPrice : 0);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium">Price Breakdown:</div>
        <div className="text-sm text-gray-500">Loading prices...</div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Price Breakdown:</div>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <span>{formattedApplianceType}</span>
            {isFreeTrialEligible && <span className="text-green-600 ml-2">(Free first try-in)</span>}
            <span className="text-gray-500 ml-2">x{quantity}</span>
          </div>
          <span>${baseTotal.toFixed(2)}</span>
        </div>
        {hasNightguard && (
          <div className="flex justify-between">
            <span>Nightguard</span>
            <span>+${nightguardPrice.toFixed(2)}</span>
          </div>
        )}
        {hasExpressDesign && (
          <div className="flex justify-between">
            <span>Express Design</span>
            <span>+${expressPrice.toFixed(2)}</span>
          </div>
        )}
        <div className="pt-2 border-t flex justify-between font-semibold">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};