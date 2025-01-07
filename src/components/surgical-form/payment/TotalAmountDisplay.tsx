import { Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PriceBreakdown } from "../PriceBreakdown";
import { CouponField } from "../CouponField";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../formSchema";

interface TotalAmountDisplayProps {
  basePrice: number;
  totalAmount: number;
  applianceType: string;
  archType: string;
  needsNightguard: string;
  expressDesign: string;
  formattedApplianceType: string;
  isLoading?: boolean;
  form?: UseFormReturn<z.infer<typeof formSchema>>;
  patientId?: string;
  onValidCoupon?: (validationResult?: { archType?: string }) => void;
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
  form,
  patientId,
  onValidCoupon,
}: TotalAmountDisplayProps) => {
  const showCouponField = applianceType === 'printed-try-in' && form && patientId;

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
      <div className="flex items-center gap-4">
        <div className="min-h-[2.5rem] flex items-center">
          {isLoading ? (
            <div className="flex items-center gap-2 text-primary">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-lg font-medium">Calculating price...</span>
            </div>
          ) : (
            <p className="text-2xl font-semibold text-gray-900">
              ${Number(totalAmount).toFixed(2)}
            </p>
          )}
        </div>
        {showCouponField && (
          <div className="flex-1">
            <CouponField 
              form={form} 
              patientId={patientId}
              onValidCoupon={onValidCoupon}
            />
          </div>
        )}
      </div>
    </div>
  );
};