import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { formSchema } from "./formSchema";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { calculateTotalPrice } from "./utils/priceCalculations";
import { STRIPE_PRODUCT_IDS, BASE_PRICES } from "./utils/priceConstants";
import { TotalAmountDisplay } from "./payment/TotalAmountDisplay";
import { SubmitButton } from "./payment/SubmitButton";

interface PaymentSectionProps {
  applianceType: string;
  archType: string;
  needsNightguard?: string;
  expressDesign?: string;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isSubmitting: boolean;
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const PaymentSection = ({ 
  applianceType, 
  archType, 
  needsNightguard = 'no',
  expressDesign = 'no',
  onSubmit, 
  isSubmitting,
  form
}: PaymentSectionProps) => {
  const { toast } = useToast();
  const productId = applianceType ? STRIPE_PRODUCT_IDS[applianceType as keyof typeof STRIPE_PRODUCT_IDS] : null;
  const basePrice = applianceType ? BASE_PRICES[applianceType as keyof typeof BASE_PRICES] : 0;

  console.log('Payment details:', {
    applianceType,
    productId,
    basePrice,
    archType,
    needsNightguard,
    expressDesign
  });

  const createCheckoutSession = useMutation({
    mutationFn: async (formData: z.infer<typeof formSchema>) => {
      console.log('Creating checkout session with:', { formData, productId });

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          formData,
          productId,
          totalAmount: calculateTotalPrice(
            basePrice,
            { archType, needsNightguard, expressDesign, applianceType }
          ),
        },
      });

      if (error) {
        console.error('Error from edge function:', error);
        throw new Error(`Checkout session creation failed: ${error.message}`);
      }

      if (!data?.url) {
        throw new Error('No checkout URL returned from server');
      }

      return data;
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: Error) => {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatApplianceType = (type: string) => {
    if (!type) return '';
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleSubmitAndPay = async (e: React.MouseEvent) => {
    e.preventDefault();
    const values = form.getValues();
    
    if (!productId) {
      toast({
        title: "Configuration Error",
        description: "Invalid appliance type selected.",
        variant: "destructive",
      });
      return;
    }

    if (Object.keys(form.formState.errors).length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    createCheckoutSession.mutate(values);
  };

  const totalAmount = calculateTotalPrice(
    basePrice,
    { archType, needsNightguard, expressDesign, applianceType }
  );

  return (
    <div className="sticky bottom-0 bg-white border-t shadow-lg p-4">
      <div className="flex justify-between items-start">
        <TotalAmountDisplay
          basePrice={basePrice}
          totalAmount={totalAmount}
          applianceType={applianceType}
          archType={archType}
          needsNightguard={needsNightguard}
          expressDesign={expressDesign}
          formattedApplianceType={formatApplianceType(applianceType)}
        />
        <SubmitButton
          isSubmitting={isSubmitting}
          isPending={createCheckoutSession.isPending}
          onClick={handleSubmitAndPay}
        />
      </div>
    </div>
  );
};