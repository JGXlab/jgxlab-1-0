import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { useQuery } from "@tanstack/react-query";
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
import { useSearchParams } from "react-router-dom";
import { usePaymentVerification } from "@/components/lab-scripts/payment/usePaymentVerification";
import { PaymentSuccessDialog } from "@/components/lab-scripts/payment/PaymentSuccessDialog";
import { z } from "zod";

export default function SubmittedLabScripts() {
  const [selectedScript, setSelectedScript] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isNewLabScriptOpen, setIsNewLabScriptOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const { 
    verifyPayment, 
    showSuccessDialog, 
    paymentDetails, 
    closeSuccessDialog 
  } = usePaymentVerification();

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

  // Handle payment status check
  useEffect(() => {
    const checkPayment = async () => {
      const sessionId = searchParams.get('session_id');
      const paymentStatus = searchParams.get('payment_status');
      const labScriptId = searchParams.get('lab_script_id');

      if (paymentStatus === 'success' && sessionId && labScriptId) {
        console.log('Initiating payment verification for session:', sessionId);
        await verifyPayment(sessionId, labScriptId);
      }
    };

    checkPayment();
  }, [searchParams, verifyPayment]);

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

  const handlePreview = (script: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedScript(script);
    setIsPreviewOpen(true);
  };

  // Type-safe onSubmit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Form values:', values);
    // Handle form submission logic here
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
                  isSubmitting={false}
                  form={form}
                />
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {paymentDetails && (
          <PaymentSuccessDialog
            isOpen={showSuccessDialog}
            onClose={closeSuccessDialog}
            paymentId={paymentDetails.paymentId}
            invoiceUrl={paymentDetails.invoiceUrl}
          />
        )}
      </div>
    </ClinicLayout>
  );
}