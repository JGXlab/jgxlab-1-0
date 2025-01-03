import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Info } from "lucide-react";
import { z } from "zod";
import { formSchema } from "./formSchema";
import { UseFormReturn } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const priceMap = {
  'surgical-day': 'e843686b-55ac-4f55-bab7-38d5c420a1b8',
  'printed-try-in': '77ae271c-2035-42d5-87a4-e312f21b3b08',
  'nightguard': '9484ff04-c982-4187-83ac-a6f6d525efaa',
  'direct-load-pmma': '3291311b-1e2b-4f06-bc06-359dd1181494',
  'direct-load-zirconia': '3291311b-1e2b-4f06-bc06-359dd1181494',
  'ti-bar': 'e5593f92-37e7-43a2-b379-cc12bbcb9da4'
};

const NIGHTGUARD_PRICE = 50;
const EXPRESS_DESIGN_PRICE = 50;

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
  const priceId = applianceType ? priceMap[applianceType as keyof typeof priceMap] : null;

  console.log('Payment details:', {
    applianceType,
    priceId,
    archType,
    needsNightguard,
    expressDesign
  });

  const { data: priceData, isLoading } = useQuery({
    queryKey: ['servicePrice', priceId],
    queryFn: async () => {
      if (!priceId) return null;
      
      const { data, error } = await supabase
        .from('service_prices')
        .select('*')
        .eq('id', priceId)
        .single();

      if (error) {
        console.error('Error fetching price:', error);
        throw error;
      }
      console.log('Fetched price data:', data);
      return data;
    },
    enabled: !!priceId,
  });

  const createCheckoutSession = useMutation({
    mutationFn: async (formData: z.infer<typeof formSchema>) => {
      console.log('Creating checkout session with:', { 
        formData, 
        priceId,
        totalAmount: calculateFinalPrice()
      });

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          formData,
          serviceId: priceId,
          totalAmount: calculateFinalPrice(),
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

  const calculateFinalPrice = () => {
    if (!priceData?.price) return '0.00';
    
    let totalPrice = Number(priceData.price);
    
    // Double the price for dual arch
    if (archType === 'dual') {
      totalPrice *= 2;
    }

    // Add nightguard price if selected
    if (needsNightguard === 'yes' && applianceType !== 'surgical-day') {
      totalPrice += NIGHTGUARD_PRICE;
    }

    // Add express design price if selected
    if (expressDesign === 'yes' && applianceType !== 'surgical-day') {
      totalPrice += EXPRESS_DESIGN_PRICE;
    }

    return totalPrice.toFixed(2);
  };

  const formatApplianceType = (type: string) => {
    if (!type) return '';
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleSubmitAndPay = async (e: React.MouseEvent) => {
    e.preventDefault();
    const values = form.getValues();
    
    if (!priceId) {
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

  const renderPriceBreakdown = () => {
    if (!priceData?.price) return null;

    const basePrice = Number(priceData.price);
    const isDual = archType === 'dual';
    const hasNightguard = needsNightguard === 'yes' && applianceType !== 'surgical-day';
    const hasExpressDesign = expressDesign === 'yes' && applianceType !== 'surgical-day';
    const quantity = isDual ? 2 : 1;

    return (
      <div className="space-y-2">
        <div className="text-sm font-medium">Price Breakdown:</div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <span>{formatApplianceType(applianceType)}</span>
              <span className="text-gray-500 ml-2">x{quantity}</span>
            </div>
            <span>${(basePrice * quantity).toFixed(2)}</span>
          </div>
          {hasNightguard && (
            <div className="flex justify-between">
              <span>Nightguard</span>
              <span>+${NIGHTGUARD_PRICE.toFixed(2)}</span>
            </div>
          )}
          {hasExpressDesign && (
            <div className="flex justify-between">
              <span>Express Design</span>
              <span>+${EXPRESS_DESIGN_PRICE.toFixed(2)}</span>
            </div>
          )}
          <div className="pt-2 border-t flex justify-between font-semibold">
            <span>Total:</span>
            <span>${calculateFinalPrice()}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="sticky bottom-0 bg-white border-t shadow-lg p-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-500">Total Amount</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                  <Info className="h-4 w-4 text-gray-500" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Price Details</DialogTitle>
                </DialogHeader>
                {renderPriceBreakdown()}
              </DialogContent>
            </Dialog>
          </div>
          {isLoading ? (
            <div className="h-6 w-20 animate-pulse bg-gray-200 rounded" />
          ) : (
            <p className="text-2xl font-semibold text-gray-900">
              ${calculateFinalPrice()}
            </p>
          )}
        </div>
        <Button 
          type="submit" 
          size="lg"
          disabled={isSubmitting || isLoading || createCheckoutSession.isPending || !priceId}
          className="min-w-[200px]"
          onClick={handleSubmitAndPay}
        >
          {createCheckoutSession.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redirecting to payment...
            </>
          ) : (
            'Submit and Pay'
          )}
        </Button>
      </div>
    </div>
  );
};