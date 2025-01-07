import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { isCouponValid } from "./utils/couponUtils";

interface CouponInputProps {
  patientId: string;
  onCouponApply: (isValid: boolean) => void;
}

export const CouponInput = ({ patientId, onCouponApply }: CouponInputProps) => {
  const [couponCode, setCouponCode] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast({
        title: "Error",
        description: "Please enter a coupon code",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    try {
      const isValid = await isCouponValid(couponCode, patientId);
      onCouponApply(isValid);
      
      if (isValid) {
        toast({
          title: "Success",
          description: "Coupon applied successfully!",
        });
      } else {
        toast({
          title: "Invalid Coupon",
          description: "This coupon is not valid for this patient",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast({
        title: "Error",
        description: "Failed to apply coupon",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Input
        placeholder="Enter coupon code"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        className="w-40"
      />
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleApplyCoupon}
        disabled={isChecking}
      >
        Apply
      </Button>
    </div>
  );
};