import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LabScriptsHeader } from "@/components/lab-scripts/LabScriptsHeader";
import { PreviewLabScriptModal } from "@/components/surgical-form/PreviewLabScriptModal";
import { useState, useEffect } from "react";
import { LabScriptsTable } from "@/components/lab-scripts/LabScriptsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "@/components/surgical-form/formSchema";
import { PatientInformationSection } from "@/components/surgical-form/PatientInformationSection";
import { ApplianceDetailsSection } from "@/components/surgical-form/ApplianceDetailsSection";
import { AdditionalInformationSection } from "@/components/surgical-form/AdditionalInformationSection";
import { PaymentSection } from "@/components/surgical-form/PaymentSection";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function SubmittedLabScripts() {
  const [selectedScript, setSelectedScript] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isNewLabScriptOpen, setIsNewLabScriptOpen] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Handle payment status check
  useEffect(() => {
    const checkPaymentStatus = async () => {
      const sessionId = searchParams.get('session_id');
      const paymentStatus = searchParams.get('payment_status');
      const labScriptId = searchParams.get('lab_script_id');

      if (paymentStatus === 'success' && sessionId && labScriptId) {
        try {
          const response = await fetch('/functions/v1/get-session-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ sessionId, labScriptId })
          });

          if (!response.ok) {
            throw new Error('Failed to verify payment');
          }

          const data = await response.json();
          console.log('Payment verification response:', data);

          if (data.status === 'paid') {
            toast({
              title: "Payment Successful",
              description: "Your lab script has been submitted successfully.",
            });
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
          toast({
            title: "Payment Verification Error",
            description: "There was an issue verifying your payment. Please contact support.",
            variant: "destructive",
          });
        }

        // Clear URL parameters
        navigate('/clinic/submittedlabscripts', { replace: true });
      } else if (paymentStatus === 'failed') {
        toast({
          title: "Payment Failed",
          description: "There was an issue processing your payment. Please try again.",
          variant: "destructive",
        });
        navigate('/clinic/submittedlabscripts', { replace: true });
      }
    };

    checkPaymentStatus();
  }, [searchParams, toast, navigate]);

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
      needsNightguard: "",
      shade: "",
      dueDate: "",
      specificInstructions: "",
      expressDesign: "",
    },
  });

  const { data: labScripts = [], isLoading } = useQuery({
    queryKey: ['labScripts'],
    queryFn: async () => {
      console.log('Fetching lab scripts...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from('lab_scripts')
        .select(`
          *,
          patients (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching lab scripts:', error);
        throw error;
      }

      console.log('Fetched lab scripts:', data);
      return data || [];
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
      setIsNewLabScriptOpen(false);
      form.reset();
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

  const handlePreview = (script: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedScript(script);
    setIsPreviewOpen(true);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    submitLabScript(values);
  };

  return (
    <ClinicLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <LabScriptsHeader />
          <Button
            onClick={() => setIsNewLabScriptOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Lab Script
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <LabScriptsTable
            labScripts={labScripts}
            isLoading={isLoading}
            onPreview={handlePreview}
          />
        </div>

        {selectedScript && (
          <PreviewLabScriptModal
            isOpen={isPreviewOpen}
            onClose={() => {
              setIsPreviewOpen(false);
              setSelectedScript(null);
            }}
            labScriptId={selectedScript.id}
          />
        )}

        <Dialog open={isNewLabScriptOpen} onOpenChange={setIsNewLabScriptOpen}>
          <DialogContent className="max-w-3xl h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>New Lab Script</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex-1 overflow-y-auto">
                <PatientInformationSection form={form} />
                <ApplianceDetailsSection form={form} />
                <AdditionalInformationSection form={form} />
                <PaymentSection 
                  applianceType={form.watch('applianceType')}
                  archType={form.watch('arch')}
                  needsNightguard={form.watch('needsNightguard')}
                  expressDesign={form.watch('expressDesign')}
                  onSubmit={onSubmit}
                  isSubmitting={isPending}
                  form={form}
                />
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </ClinicLayout>
  );
}