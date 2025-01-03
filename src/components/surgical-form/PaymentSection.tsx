import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { formSchema } from "./formSchema";

const priceMap = {
  'surgical-day': 'e843686b-55ac-4f55-bab7-38d5c420a1b8',
  'printed-try-in': '77ae271c-2035-42d5-87a4-e312f21b3b08',
  'nightguard': '9484ff04-c982-4187-83ac-a6f6d525efaa',
  'direct-load-pmma': '3291311b-1e2b-4f06-bc06-359dd1181494',
  'direct-load-zirconia': '3291311b-1e2b-4f06-bc06-359dd1181494',
  'ti-bar': 'e5593f92-37e7-43a2-b379-cc12bbcb9da4'
};

export interface PaymentSectionProps {
  applianceType: string;
  archType: string;
  formData: z.infer<typeof formSchema>;
  isSubmitting: boolean;
}

export const PaymentSection = ({ applianceType, archType, formData, isSubmitting }: PaymentSectionProps) => {
  const { toast } = useToast();
  const priceId = applianceType ? priceMap[applianceType as keyof typeof priceMap] : null;

  const { data: priceData, isLoading } = useQuery({
    queryKey: ['servicePrice', priceId],
    queryFn: async () => {
      if (!priceId) return null;
      
      const { data, error } = await supabase
        .from('service_prices')
        .select('*')
        .eq('id', priceId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!priceId,
  });

  // Calculate final price based on arch type and additional services
  const calculateFinalPrice = () => {
    if (!priceData?.price) return '0.00';
    let totalPrice = Number(priceData.price);

    if (archType === 'dual') {
      totalPrice *= 2;
    }

    if (formData.needsNightguard === 'yes') {
      const nightguardPrice = 150;
      totalPrice += nightguardPrice;
    }

    if (formData.expressDesign === 'yes') {
      const expressFee = 100;
      totalPrice += expressFee;
    }

    return totalPrice.toFixed(2);
  };

  const handleCheckout = async () => {
    try {
      console.log('Creating checkout session with form data:', formData);
      
      const { data: session, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          formData,
          totalAmount: calculateFinalPrice(),
          metadata: {
            formData: JSON.stringify(formData)
          }
        }
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        toast({
          title: "Error",
          description: "Failed to create checkout session. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (!session?.url) {
        console.error('No checkout URL returned');
        toast({
          title: "Error",
          description: "Invalid checkout session response. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = session.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!applianceType) return null;

  return (
    <div className="sticky bottom-0 bg-white border-t shadow-lg p-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Total Amount</p>
          {isLoading ? (
            <div className="h-6 w-20 animate-pulse bg-gray-200 rounded" />
          ) : (
            <p className="text-2xl font-semibold text-gray-900">
              ${calculateFinalPrice()}
              {archType === 'dual' && (
                <span className="text-sm text-gray-500 ml-2">(Dual arch price)</span>
              )}
            </p>
          )}
        </div>
        <Button 
          onClick={handleCheckout}
          size="lg"
          disabled={isSubmitting || isLoading}
          className="min-w-[200px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Submit and Pay'
          )}
        </Button>
      </div>
    </div>
  );
};