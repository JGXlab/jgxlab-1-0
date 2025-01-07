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
  const [isFreeTrialEligible, setIsFreeTrialEligible] = useState(false);

  const patientId = form.watch('patientId');

  // Check if patient is eligible for free printed try-in
  const { data: eligibilityData, isLoading: isCheckingEligibility } = useQuery({
    queryKey: ['free-tryin-eligibility', patientId],
    queryFn: async () => {
      if (!patientId || applianceType !== 'printed-try-in') {
        console.log('Not checking eligibility - not a printed try-in or no patient ID');
        return { isEligible: false };
      }

      console.log('Checking free try-in eligibility for patient:', patientId);

      // First check if patient has any previous free try-ins
      const { data: existingFreeTrials, error: freeTrialsError } = await supabase
        .from('lab_scripts')
        .select('id')
        .eq('patient_id', patientId)
        .eq('is_free_printed_tryin', true)
        .maybeSingle();

      if (freeTrialsError) {
        console.error('Error checking free trials:', freeTrialsError);
        toast({
          title: "Error",
          description: "Failed to check free try-in eligibility",
          variant: "destructive",
        });
        return { isEligible: false };
      }

      if (existingFreeTrials) {
        console.log('Patient already had a free try-in');
        toast({
          title: "Not Eligible",
          description: "This patient has already used their free printed try-in.",
          variant: "default",
        });
        return { isEligible: false };
      }

      // Then check if patient has a surgical day appliance that's either pending or completed
      const { data: surgicalAppliance, error: surgicalError } = await supabase
        .from('lab_scripts')
        .select('id, status')
        .eq('patient_id', patientId)
        .eq('appliance_type', 'surgical-day')
        .in('status', ['pending', 'completed'])
        .maybeSingle();

      if (surgicalError) {
        console.error('Error checking surgical appliances:', surgicalError);
        toast({
          title: "Error",
          description: "Failed to check surgical appliance status",
          variant: "destructive",
        });
        return { isEligible: false };
      }

      const isEligible = !!surgicalAppliance && !existingFreeTrials;
      console.log('Free try-in eligibility:', isEligible);
      
      if (!isEligible && !surgicalAppliance) {
        toast({
          title: "Not Eligible",
          description: "Free printed try-in is only available for patients with a surgical day appliance.",
          variant: "default",
        });
      }
      
      return { isEligible };
    },
    enabled: !!patientId && applianceType === 'printed-try-in'
  });

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

  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const updatePrices = async () => {
      setIsCalculating(true);
      try {
        // If eligible for free try-in, set total to 0 and skip price calculation
        if (eligibilityData?.isEligible) {
          setTotalAmount(0);
          setLineItems([]);
          return;
        }

        const result = await calculateTotalPrice(
          basePrice,
          { archType, needsNightguard, expressDesign, applianceType }
        );
        setTotalAmount(result.total);
        setLineItems(result.lineItems);
      } finally {
        setIsCalculating(false);
      }
    };

    updatePrices();
  }, [basePrice, archType, needsNightguard, expressDesign, applianceType, eligibilityData?.isEligible]);

  console.log('Payment details:', {
    applianceType,
    basePrice,
    archType,
    needsNightguard,
    expressDesign,
    lineItems,
    isFreeTrialEligible: eligibilityData?.isEligible
  });

  const createCheckoutSession = useMutation({
    mutationFn: async (formData: z.infer<typeof formSchema>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // If it's a free try-in, create lab script directly without payment
      if (eligibilityData?.isEligible) {
        console.log('Creating free printed try-in lab script');
        const { data: labScript, error } = await supabase
          .from('lab_scripts')
          .insert({
            patient_id: formData.patientId,
            appliance_type: formData.applianceType,
            arch: formData.arch,
            treatment_type: formData.treatmentType,
            screw_type: formData.screwType,
            other_screw_type: formData.otherScrewType,
            vdo_details: formData.vdoDetails,
            needs_nightguard: formData.needsNightguard,
            shade: formData.shade,
            due_date: formData.dueDate,
            specific_instructions: formData.specificInstructions,
            express_design: formData.expressDesign,
            user_id: user.id,
            payment_status: 'paid',
            amount_paid: 0,
            is_free_printed_tryin: true,
            payment_date: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        return { url: null, isFree: true };
      }

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

      return { url: data.url, isFree: false };
    },
    onSuccess: (data) => {
      if (data.isFree) {
        toast({
          title: "Success",
          description: "Free printed try-in lab script created successfully!",
        });
        // Redirect to submitted lab scripts page
        window.location.href = "/clinic/submittedlabscripts";
      } else if (data.url) {
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

  const isLoading = isPriceLoading || isCalculating || isCheckingEligibility;

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
          formattedApplianceType={applianceType.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
          isLoading={isLoading}
          isFreeTrialEligible={eligibilityData?.isEligible}
        />
        <SubmitButton
          isSubmitting={isSubmitting}
          isPending={createCheckoutSession.isPending}
          onClick={handleSubmitAndPay}
          disabled={isLoading}
          isFreeTrialEligible={eligibilityData?.isEligible}
        />
      </div>
    </div>
  );
};