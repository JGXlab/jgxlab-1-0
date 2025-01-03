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
  const [lineItems, setLineItems] = useState<Array<{ service_name: string; quantity: number }>>([]);

  const { data: servicePrices = [], isLoading: isPriceLoading } = useQuery({
    queryKey: ['service-prices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_prices')
        .select('*');

      if (error) {
        console.error('Error fetching prices:', error);
        return [];
      }

      return data || [];
    },
  });

  useEffect(() => {
    const updatePrices = async () => {
      const newLineItems: Array<{ service_name: string; quantity: number }> = [];

      // Add base appliance
      newLineItems.push({
        service_name: applianceType,
        quantity: archType === 'dual' ? 2 : 1,
      });

      // Add nightguard if selected
      if (needsNightguard === 'yes' && applianceType !== 'surgical-day') {
        newLineItems.push({
          service_name: 'additional-nightguard',
          quantity: 1,
        });
      }

      // Add express design if selected
      if (expressDesign === 'yes' && applianceType !== 'surgical-day') {
        newLineItems.push({
          service_name: 'express-design',
          quantity: 1,
        });
      }

      console.log('Updated line items:', newLineItems);
      setLineItems(newLineItems);

      // Calculate total price
      const baseService = servicePrices.find(p => p.service_name === applianceType);
      const result = await calculateTotalPrice(
        baseService?.price || 0,
        { archType, needsNightguard, expressDesign, applianceType }
      );
      setTotalAmount(result.total);
    };

    updatePrices();
  }, [servicePrices, archType, needsNightguard, expressDesign, applianceType]);

  const createCheckoutSession = useMutation({
    mutationFn: async (formData: z.infer<typeof formSchema>) => {
      console.log('Creating checkout session with:', { formData, lineItems });

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          formData,
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

  return (
    <div className="sticky bottom-0 bg-white border-t shadow-lg p-4">
      <div className="flex justify-between items-start">
        <TotalAmountDisplay
          basePrice={0}
          totalAmount={totalAmount}
          applianceType={applianceType}
          archType={archType}
          needsNightguard={needsNightguard}
          expressDesign={expressDesign}
          formattedApplianceType={formatApplianceType(applianceType)}
          isLoading={isPriceLoading}
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