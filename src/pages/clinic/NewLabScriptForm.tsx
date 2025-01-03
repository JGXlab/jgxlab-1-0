import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "@/components/surgical-form/formSchema";
import { PatientInformationSection } from "@/components/surgical-form/PatientInformationSection";
import { ApplianceDetailsSection } from "@/components/surgical-form/ApplianceDetailsSection";
import { AdditionalInformationSection } from "@/components/surgical-form/AdditionalInformationSection";
import { PreviewLabScriptModal } from "@/components/surgical-form/PreviewLabScriptModal";
import { PaymentSection } from "@/components/surgical-form/PaymentSection";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function NewLabScriptForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPreview, setShowPreview] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      applianceType: "",
      arch: "",
      treatmentType: "",
      screwType: "",
      otherScrewType: "",
      vdoDetails: "",
      needsNightguard: "no",
      shade: "",
      dueDate: "",
      specificInstructions: "",
      expressDesign: "no",
    },
  });

  const { mutate: submitLabScript, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from('lab_scripts')
        .insert([
          {
            patient_id: values.patientId,
            appliance_type: values.applianceType,
            arch: values.arch,
            treatment_type: values.treatmentType,
            screw_type: values.screwType,
            other_screw_type: values.otherScrewType,
            vdo_details: values.vdoDetails,
            needs_nightguard: values.needsNightguard,
            shade: values.shade,
            due_date: values.dueDate,
            specific_instructions: values.specificInstructions,
            express_design: values.expressDesign,
            user_id: user.id,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Lab script has been submitted successfully",
      });
      navigate("/clinic/submittedlabscripts");
    },
    onError: (error) => {
      console.error('Error submitting lab script:', error);
      toast({
        title: "Error",
        description: "Failed to submit lab script. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    submitLabScript(values);
  };

  const watchedValues = {
    applianceType: form.watch('applianceType'),
    arch: form.watch('arch'),
    needsNightguard: form.watch('needsNightguard'),
    expressDesign: form.watch('expressDesign'),
  };

  return (
    <ClinicLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="sticky top-0 z-10 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/clinic/submittedlabscripts")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">New Lab Script</h1>
                  <p className="text-sm text-gray-500">Create a new lab script request</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <PatientInformationSection form={form} />
                <ApplianceDetailsSection form={form} />
                <AdditionalInformationSection form={form} />
                <PaymentSection 
                  applianceType={watchedValues.applianceType}
                  archType={watchedValues.arch}
                  needsNightguard={watchedValues.needsNightguard}
                  expressDesign={watchedValues.expressDesign}
                  onSubmit={onSubmit}
                  isSubmitting={isPending}
                />
              </form>
            </Form>
          </div>
        </div>
      </div>

      <PreviewLabScriptModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        formData={form.getValues()}
      />
    </ClinicLayout>
  );
}