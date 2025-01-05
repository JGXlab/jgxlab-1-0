import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LabScriptsHeader } from "@/components/lab-scripts/LabScriptsHeader";
import { PreviewLabScriptModal } from "@/components/surgical-form/PreviewLabScriptModal";
import { useState, useEffect } from "react";
import { LabScriptsTable } from "@/components/lab-scripts/LabScriptsTable";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
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
import { StatusCardsGrid } from "@/components/lab-scripts/StatusCardsGrid";

export default function SubmittedLabScripts() {
  const [selectedScript, setSelectedScript] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isNewLabScriptOpen, setIsNewLabScriptOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

      if (paymentStatus === 'success' && sessionId) {
        console.log('Initiating payment verification for session:', sessionId);
        await verifyPayment(sessionId);
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Form values:', values);
  };

  // Calculate status counts
  const statusCounts = {
    new: labScripts.filter(script => script.status === 'pending').length,
    inProcess: labScripts.filter(script => script.status === 'in_progress').length,
    paused: labScripts.filter(script => script.status === 'paused').length,
    onHold: labScripts.filter(script => script.status === 'on_hold').length,
    incomplete: labScripts.filter(script => script.status === 'incomplete').length,
    completed: labScripts.filter(script => script.status === 'completed').length,
    all: labScripts.length
  };

  return (
    <ClinicLayout>
      <div className="flex flex-col max-w-[1200px] w-full mx-auto h-screen py-8">
        <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
          <ClinicNavHeader />
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lab Scripts</h1>
                <p className="text-sm text-gray-500">Manage and track your lab script submissions</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-gray-600 z-10" />
                  <input
                    type="text"
                    placeholder="Search lab scripts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-full border border-gray-200 w-64 focus:outline-none focus:ring-2 focus:ring-primary bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white"
                  />
                </div>
                <Button
                  onClick={() => setIsNewLabScriptOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Lab Script
                </Button>
              </div>
            </div>

            <StatusCardsGrid 
              statusCounts={statusCounts}
              selectedStatus={null}
              onStatusSelect={() => {}}
            />

            <Card className="bg-gradient-to-br from-white to-accent/30 border-none shadow-lg">
              <LabScriptsTable
                labScripts={labScripts.filter(script => {
                  const patientName = `${script.patients?.first_name} ${script.patients?.last_name}`.toLowerCase();
                  return patientName.includes(searchTerm.toLowerCase());
                })}
                isLoading={isLoading}
                onPreview={handlePreview}
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