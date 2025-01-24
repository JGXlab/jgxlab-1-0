import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { validateCoupon } from "./utils/couponUtils";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./formSchema";
import { Check, X } from "lucide-react";

interface CouponFieldProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  patientId: string;
  onValidCoupon?: (validationResult?: { archType?: string }) => void;
}

export const CouponField = ({ form, patientId, onValidCoupon }: CouponFieldProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const [showInput, setShowInput] = useState(false);

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
        setShowInput(false);
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

  if (!showInput) {
    return (
      <Button
        type="button"
        variant="ghost"
        className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
        onClick={() => setShowInput(true)}
      >
        Apply Free Printed Try-in Coupon
      </Button>
    );
  }

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
              size="icon"
              variant="ghost"
              onClick={handleValidateCoupon}
              disabled={isValidating}
              className="h-10 w-10 text-primary hover:text-primary/80"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button 
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => {
                setShowInput(false);
                form.setValue('couponCode', '');
              }}
              className="h-10 w-10 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};