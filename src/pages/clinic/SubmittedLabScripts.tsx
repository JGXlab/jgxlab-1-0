import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LabScriptsHeader } from "@/components/lab-scripts/LabScriptsHeader";
import { PreviewLabScriptModal } from "@/components/surgical-form/PreviewLabScriptModal";
import { useState, useEffect } from "react";
import { LabScriptsTable } from "@/components/lab-scripts/LabScriptsTable";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function SubmittedLabScripts() {
  const [selectedScript, setSelectedScript] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
    }
  });

  const updatePaymentStatus = useMutation({
    mutationFn: async ({ labScriptId, sessionId }: { labScriptId: string, sessionId: string }) => {
      const response = await fetch(`/api/get-payment-info?sessionId=${sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch payment information');
      }
      const paymentInfo = await response.json();
      
      console.log('Payment info received:', paymentInfo);

      const { error } = await supabase
        .from('lab_scripts')
        .update({
          payment_status: paymentInfo.payment_status,
          payment_id: paymentInfo.payment_intent_id
        })
        .eq('id', labScriptId);

      if (error) throw error;
      return paymentInfo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labScripts'] });
      toast({
        title: "Payment Status Updated",
        description: "The payment status has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating payment status:', error);
      toast({
        title: "Error",
        description: "Failed to update payment status. Please try again.",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    const labScriptId = searchParams.get('lab_script_id');

    if (sessionId && labScriptId) {
      console.log('Processing successful payment:', { sessionId, labScriptId });
      updatePaymentStatus.mutate({ sessionId, labScriptId });
      
      // Clear URL parameters
      navigate('/clinic/submittedlabscripts', { replace: true });
    }
  }, [searchParams, navigate, updatePaymentStatus]);

  const handlePreview = (script: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedScript(script);
    setIsPreviewOpen(true);
  };

  return (
    <ClinicLayout>
      <div className="p-6 space-y-6">
        <LabScriptsHeader />
        
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
      </div>
    </ClinicLayout>
  );
}