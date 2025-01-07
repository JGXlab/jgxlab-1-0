import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { formSchema } from "./formSchema";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { calculateTotalPrice } from "./utils/priceCalculations";
import { TotalAmountDisplay } from "./payment/TotalAmountDisplay";
import { SubmitButton } from "./payment/SubmitButton";
import { useEffect, useState } from "react";

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
  const [totalAmount, setTotalAmount] = useState(0);
  const [lineItems, setLineItems] = useState<Array<{ price: string; quantity: number }>>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [surgicalDayArch, setSurgicalDayArch] = useState<string | undefined>();

  const isFreeScript = form.watch('is_free_printed_tryin');
  const patientId = form.watch('patientId');

  // Watch for patient changes and reset coupon
  useEffect(() => {
    console.log('Patient changed, resetting coupon');
    form.setValue('is_free_printed_tryin', false);
    form.setValue('couponCode', '');
    setSurgicalDayArch(undefined);
  }, [patientId, form]);

  const { data: basePrice = 0, isLoading: isPriceLoading } = useQuery({
    queryKey: ['service-price', applianceType],
    queryFn: async () => {
      if (!applianceType) return 0;
      const { data, error } = await supabase
        .from('service_prices')
        .select('price')
        .eq('service_name', applianceType)
        .maybeSingle();

      if (error) {
        console.error('Error fetching price:', error);
        return 0;
      }

      return data?.price ?? 0;
    },
    enabled: !!applianceType,
  });

  useEffect(() => {
    const updatePrices = async () => {
      setIsCalculating(true);
      try {
        const result = await calculateTotalPrice(
          basePrice,
          { 
            archType, 
            needsNightguard, 
            expressDesign, 
            applianceType,
            isFreeScript,
            surgicalDayArch
          }
        );
        setTotalAmount(result.total);
        setLineItems(result.lineItems);
      } finally {
        setIsCalculating(false);
      }
    };

    updatePrices();
  }, [basePrice, archType, needsNightguard, expressDesign, applianceType, isFreeScript, surgicalDayArch]);

  const createCheckoutSession = useMutation({
    mutationFn: async (formData: z.infer<typeof formSchema>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      console.log('Creating checkout session with:', { formData, lineItems });

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          formData: { ...formData, userId: user.id },
          lineItems,
          applianceType,
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

  const isLoading = isPriceLoading || isCalculating;

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
          isLoading={isLoading}
          form={form}
          patientId={patientId}
          onValidCoupon={(validationResult?: { archType?: string }) => {
            console.log('Valid coupon applied');
            if (validationResult?.archType) {
              setSurgicalDayArch(validationResult.archType);
            }
          }}
        />
        <SubmitButton
          isSubmitting={isSubmitting}
          isPending={createCheckoutSession.isPending}
          onClick={handleSubmitAndPay}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};