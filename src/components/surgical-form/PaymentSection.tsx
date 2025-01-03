import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Info } from "lucide-react";
import { z } from "zod";
import { formSchema } from "./formSchema";
import { UseFormReturn } from "react-hook-form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  // Calculate final price based on arch type and add-ons
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

  if (!applianceType) return null;

  // Function to render price breakdown
  const renderPriceBreakdown = () => {
    if (!priceData?.price) return null;

    const basePrice = Number(priceData.price);
    const isDual = archType === 'dual';
    const hasNightguard = needsNightguard === 'yes' && applianceType !== 'surgical-day';
    const hasExpressDesign = expressDesign === 'yes' && applianceType !== 'surgical-day';

    return (
      <div className="space-y-1 text-sm">
        <div>Base price: ${basePrice.toFixed(2)}</div>
        {isDual && <div>Dual arch: ${(basePrice * 2).toFixed(2)}</div>}
        {hasNightguard && <div>Nightguard: +${NIGHTGUARD_PRICE.toFixed(2)}</div>}
        {hasExpressDesign && <div>Express design: +${EXPRESS_DESIGN_PRICE.toFixed(2)}</div>}
      </div>
    );
  };

  return (
    <div className="sticky bottom-0 bg-white border-t shadow-lg p-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-500">Total Amount</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                    <Info className="h-4 w-4 text-gray-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {renderPriceBreakdown()}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
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
          disabled={isSubmitting || isLoading}
          className="min-w-[200px]"
          onClick={(e) => {
            e.preventDefault();
            onSubmit(form.getValues());
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit and Pay'
          )}
        </Button>
      </div>
    </div>
  );
};