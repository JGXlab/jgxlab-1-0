import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { formSchema } from "../formSchema";

export const useSubmitFreeLabScript = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData: z.infer<typeof formSchema>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      console.log('Submitting free lab script:', formData);

      // Map form data to match database schema
      const labScriptData = {
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
        coupon_code: formData.couponCode,
        is_free_printed_tryin: formData.is_free_printed_tryin,
        user_id: user.id,
        payment_status: 'paid',
        amount_paid: 0,
        payment_date: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('lab_scripts')
        .insert([labScriptData])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

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
};