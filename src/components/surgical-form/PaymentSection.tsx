import { FormSection } from "./FormSection";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./formSchema";
import { TotalAmountDisplay } from "./payment/TotalAmountDisplay";
import { calculateTotalAmount, formatApplianceType } from "./utils/priceCalculations";
import { PaymentButton } from "../lab-scripts/PaymentButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PaymentSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  applianceType: string;
  archType: string;
  needsNightguard: string;
  expressDesign: string;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isSubmitting: boolean;
}

export const PaymentSection = ({
  form,
  applianceType,
  archType,
  needsNightguard,
  expressDesign,
  onSubmit,
  isSubmitting,
}: PaymentSectionProps) => {
  const formattedApplianceType = formatApplianceType(applianceType);
  const basePrice = 100; // This should match your base price logic
  const totalAmount = calculateTotalAmount({
    basePrice,
    applianceType,
    archType,
    needsNightguard,
    expressDesign,
  });

  const handlePayment = async (e: React.MouseEvent) => {
    e.preventDefault();
    const values = form.getValues();
    
    try {
      console.log("Starting payment process...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("User not authenticated");
        return;
      }

      const response = await supabase.functions.invoke('create-checkout-session', {
        body: { amount: totalAmount },
      });

      if (response.error) {
        console.error('Error creating checkout session:', response.error);
        toast.error("Failed to initiate payment. Please try again.");
        return;
      }

      console.log("Payment session created, submitting form...");
      onSubmit(values);
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error("Failed to process payment. Please try again.");
    }
  };

  return (
    <FormSection title="Payment Details">
      <div className="space-y-6">
        <TotalAmountDisplay
          basePrice={basePrice}
          totalAmount={totalAmount}
          applianceType={applianceType}
          archType={archType}
          needsNightguard={needsNightguard}
          expressDesign={expressDesign}
          formattedApplianceType={formattedApplianceType}
          isLoading={isSubmitting}
        />
        
        <PaymentButton
          amount={totalAmount}
          onClick={handlePayment}
          isLoading={isSubmitting}
        />
      </div>
    </FormSection>
  );
};