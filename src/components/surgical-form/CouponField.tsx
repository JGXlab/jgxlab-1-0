import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { validateCoupon } from "./utils/couponUtils";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./formSchema";

interface CouponFieldProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  patientId: string;
  onValidCoupon?: (validationResult?: { archType?: string }) => void;
}

export const CouponField = ({ form, patientId, onValidCoupon }: CouponFieldProps) => {
  const [isValidating, setIsValidating] = useState(false);

  const handleValidateCoupon = async () => {
    const couponCode = form.watch('couponCode');
    
    if (!couponCode) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsValidating(true);
    try {
      const result = await validateCoupon(couponCode, patientId);
      
      if (result.isValid) {
        toast.success(result.message);
        form.setValue('is_free_printed_tryin', true);
        form.setValue('couponCode', couponCode);
        onValidCoupon?.(result);
      } else {
        toast.error(result.message);
        form.setValue('is_free_printed_tryin', false);
        form.setValue('couponCode', '');
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      toast.error("Error validating coupon");
      form.setValue('is_free_printed_tryin', false);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <FormField
      control={form.control}
      name="couponCode"
      render={({ field }) => (
        <FormItem className="space-y-1.5">
          <div className="flex gap-2">
            <FormControl>
              <Input
                placeholder="Enter coupon code"
                {...field}
                className="bg-white border-gray-200 focus:border-primary focus:ring-primary"
              />
            </FormControl>
            <Button 
              type="button"
              variant="secondary"
              onClick={handleValidateCoupon}
              disabled={isValidating}
              className="whitespace-nowrap hover:bg-secondary-hover transition-colors"
            >
              {isValidating ? 'Validating...' : 'Validate'}
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};