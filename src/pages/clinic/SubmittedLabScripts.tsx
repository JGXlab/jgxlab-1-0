import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { useQuery } from "@tanstack/react-query";
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

  const { data: labScripts = [], isLoading, refetch } = useQuery({
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
    refetchInterval: 5000 // Refetch every 5 seconds to get payment updates
  });

  // Handle payment status on component mount
  useEffect(() => {
    const paymentStatus = searchParams.get('payment_status');
    const labScriptId = searchParams.get('lab_script_id');

    if (paymentStatus === 'success') {
      toast({
        title: "Payment Successful",
        description: "Your lab script has been submitted successfully.",
      });
      
      // If we have a lab script ID, show its preview
      if (labScriptId) {
        const fetchLabScript = async () => {
          const { data: labScript } = await supabase
            .from('lab_scripts')
            .select('*')
            .eq('id', labScriptId)
            .single();

          if (labScript) {
            setSelectedScript(labScript);
            setIsPreviewOpen(true);
          }
        };
        
        fetchLabScript();
      }

      // Refetch to get the latest payment status
      refetch();
    } else if (paymentStatus === 'failed') {
      toast({
        title: "Payment Failed",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
    }

    // Clear the URL parameters
    if (paymentStatus) {
      navigate('/clinic/submittedlabscripts', { replace: true });
    }
  }, [searchParams, toast, navigate, refetch]);

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