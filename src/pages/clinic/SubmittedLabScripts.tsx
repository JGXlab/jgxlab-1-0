import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { PreviewLabScriptModal } from "@/components/surgical-form/PreviewLabScriptModal";
import { useState, useEffect } from "react";
import { LabScriptsTable } from "@/components/lab-scripts/LabScriptsTable";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClinicNavHeader } from "@/components/clinic/ClinicNavHeader";
import { Card } from "@/components/ui/card";
import { LabScriptsPageHeader } from "@/components/lab-scripts/LabScriptsPageHeader";
import { useLabScripts } from "@/hooks/use-lab-scripts";

export default function SubmittedLabScripts() {
  const [selectedScript, setSelectedScript] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isNewLabScriptOpen, setIsNewLabScriptOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
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

  const { labScripts, statusCounts, isLoading } = useLabScripts(selectedStatus);

  useEffect(() => {
    const checkPayment = async () => {
      const sessionId = searchParams.get('session_id');
      const paymentStatus = searchParams.get('payment_status');

      if (paymentStatus === 'success' && sessionId) {
        console.log('Initiating payment verification for session:', sessionId);
        await verifyPayment(sessionId);
      }
    };

    checkPayment();
  }, [searchParams, verifyPayment]);

  const handlePreview = (script: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedScript(script);
    setIsPreviewOpen(true);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Form values:', values);
  };

  const handleStatusSelect = (status: string | null) => {
    console.log('Selected status:', status);
    setSelectedStatus(status);
  };

  return (
    <ClinicLayout>
      <div className="flex flex-col max-w-[1400px] w-full mx-auto h-screen py-8">
        <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
          <ClinicNavHeader />
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <LabScriptsPageHeader
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onNewLabScript={() => setIsNewLabScriptOpen(true)}
              statusCounts={statusCounts}
              selectedStatus={selectedStatus}
              onStatusSelect={handleStatusSelect}
            />

            <Card className="bg-gradient-to-br from-white to-accent/30 border-none shadow-lg">
              <LabScriptsTable
                labScripts={labScripts.filter(script => {
                  const patientName = `${script.patients?.first_name} ${script.patients?.last_name}`.toLowerCase();
                  return patientName.includes(searchTerm.toLowerCase());
                })}
                isLoading={isLoading}
                onPreview={handlePreview}
                hideClinicColumn={true} // Add this prop to hide clinic column in clinic portal
              />
            </Card>

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
        </ScrollArea>
      </div>
    </ClinicLayout>
  );
}