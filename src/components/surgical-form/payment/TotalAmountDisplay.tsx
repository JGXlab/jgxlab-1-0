import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PriceBreakdown } from "../PriceBreakdown";

interface TotalAmountDisplayProps {
  basePrice: number;
  totalAmount: number;
  applianceType: string;
  archType: string;
  needsNightguard: string;
  expressDesign: string;
  formattedApplianceType: string;
  isLoading?: boolean;
}

export const TotalAmountDisplay = ({
  basePrice,
  totalAmount,
  applianceType,
  archType,
  needsNightguard,
  expressDesign,
  formattedApplianceType,
  isLoading = false,
}: TotalAmountDisplayProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <p className="text-sm font-medium text-gray-500">Total Amount</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
              <Info className="h-4 w-4 text-gray-500" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Price Details</DialogTitle>
            </DialogHeader>
            <PriceBreakdown
              basePrice={basePrice}
              archType={archType}
              needsNightguard={needsNightguard}
              expressDesign={expressDesign}
              applianceType={applianceType}
              formattedApplianceType={formattedApplianceType}
            />
          </DialogContent>
        </Dialog>
      </div>
      <p className="text-2xl font-semibold text-gray-900">
        {isLoading ? (
          <span className="text-gray-400">Loading...</span>
        ) : (
          `$${totalAmount.toFixed(2)}`
        )}
      </p>
    </div>
  );
};