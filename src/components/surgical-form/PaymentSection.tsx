import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { formSchema } from "./formSchema";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { calculateTotalPrice } from "./utils/priceCalculations";
import { TotalAmountDisplay } from "./payment/TotalAmountDisplay";
import { useEffect, useState } from "react";
import { PaymentButton } from "../lab-scripts/PaymentButton";

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
      // Find the base price for the appliance type
      const baseService = servicePrices.find(p => p.service_name === applianceType);
      const nightguardService = servicePrices.find(p => p.service_name === 'additional-nightguard');
      const expressService = servicePrices.find(p => p.service_name === 'express-design');

      const newLineItems: Array<{ price: string; quantity: number }> = [];

      if (baseService?.stripe_price_id) {
        newLineItems.push({
          price: baseService.stripe_price_id,
          quantity: archType === 'dual' ? 2 : 1,
        });
      }

      if (needsNightguard === 'yes' && nightguardService?.stripe_price_id) {
        newLineItems.push({
          price: nightguardService.stripe_price_id,
          quantity: 1,
        });
      }

      if (expressDesign === 'yes' && expressService?.stripe_price_id) {
        newLineItems.push({
          price: expressService.stripe_price_id,
          quantity: 1,
        });
      }

      console.log('Updated line items:', newLineItems);
      setLineItems(newLineItems);

      const result = await calculateTotalPrice(
        baseService?.price || 0,
        { archType, needsNightguard, expressDesign, applianceType }
      );
      setTotalAmount(result.total);
    };

    updatePrices();
  }, [servicePrices, archType, needsNightguard, expressDesign, applianceType]);

  const formatApplianceType = (type: string) => {
    if (!type) return '';
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handlePayment = async () => {
    const formValues = form.getValues();
    console.log('Form values:', formValues);
    onSubmit(formValues);
  };

  return (
    <div className="sticky bottom-0 bg-white border-t shadow-lg p-4">
      <div className="flex justify-between items-center">
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
        <PaymentButton
          onClick={handlePayment}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
};
