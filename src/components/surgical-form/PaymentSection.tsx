import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { formSchema } from "./formSchema";
import { UseFormReturn } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { TotalAmountDisplay } from "./payment/TotalAmountDisplay";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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

  // Query to get the surgical day price
  const { data: surgicalDayPrice, isLoading: isPriceLoading } = useQuery({
    queryKey: ['surgical-day-price'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_prices')
        .select('*')
        .eq('service_name', 'surgical-day')
        .single();

      if (error) {
        console.error('Error fetching surgical day price:', error);
        return null;
      }

      return data;
    },
  });

  const createCheckoutSession = useMutation({
    mutationFn: async (formData: z.infer<typeof formSchema>) => {
      if (!surgicalDayPrice?.stripe_price_id) {
        throw new Error('Surgical day price not found');
      }

      const lineItems = [{
        price: surgicalDayPrice.stripe_price_id,
        quantity: 1
      }];

      console.log('Creating checkout session with:', { formData, lineItems });

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          formData,
          lineItems,
          applianceType: 'surgical-day'
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

  const handlePayment = async (e: React.MouseEvent) => {
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
          basePrice={surgicalDayPrice?.price || 0}
          totalAmount={surgicalDayPrice?.price || 0}
          applianceType={applianceType}
          archType={archType}
          needsNightguard={needsNightguard}
          expressDesign={expressDesign}
          formattedApplianceType="Surgical Day"
          isLoading={isPriceLoading}
        />
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || createCheckoutSession.isPending || !surgicalDayPrice}
          className="min-w-[200px]"
          onClick={handlePayment}
        >
          {createCheckoutSession.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redirecting to payment...
            </>
          ) : (
            'Pay for Surgical Day'
          )}
        </Button>
      </div>
    </div>
  );
};