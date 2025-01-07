import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { formSchema } from "../formSchema";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useLabScriptMutations = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const submitFreeLabScript = useMutation({
    mutationFn: async (formData: z.infer<typeof formSchema>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('lab_scripts')
        .insert([{
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
          payment_status: 'free',
          is_free_printed_tryin: formData.is_free_printed_tryin,
          coupon_code: formData.couponCode
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Lab script submitted successfully",
      });
      navigate('/clinic/submittedlabscripts');
    },
    onError: (error: Error) => {
      console.error('Error submitting lab script:', error);
      toast({
        title: "Error",
        description: "Failed to submit lab script. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createCheckoutSession = useMutation({
    mutationFn: async (params: { 
      formData: z.infer<typeof formSchema>;
      lineItems: Array<{ price: string; quantity: number }>;
      applianceType: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      console.log('Creating checkout session with:', params);

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          formData: { ...params.formData, userId: user.id },
          lineItems: params.lineItems,
          applianceType: params.applianceType,
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

  return {
    submitFreeLabScript,
    createCheckoutSession,
  };
};