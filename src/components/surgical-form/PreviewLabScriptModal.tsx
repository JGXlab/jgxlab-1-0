import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Tables } from "@/integrations/supabase/types";
import { z } from "zod";
import { formSchema } from "./formSchema";
import { PreviewHeader } from "./preview/PreviewHeader";
import { PreviewContent } from "./preview/PreviewContent";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface PreviewLabScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  labScriptId?: string;
  formData?: z.infer<typeof formSchema>;
}

export const PreviewLabScriptModal = ({
  isOpen,
  onClose,
  labScriptId,
  formData,
}: PreviewLabScriptModalProps) => {
  const [labScript, setLabScript] = useState<Tables<"lab_scripts"> | null>(null);

  // Transform formData to lab script if available
  useEffect(() => {
    if (formData && !labScriptId) {
      const transformedData = {
        id: 'preview',
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
        created_at: new Date().toISOString(),
        status: 'preview',
        user_id: 'preview'
      } as Tables<"lab_scripts">;
      
      setLabScript(transformedData);
    }
  }, [formData]);

  // Fetch patient details with proper error handling
  const { data: patient, isLoading: isLoadingPatient, error: patientError } = useQuery({
    queryKey: ['patient', labScript?.patient_id],
    queryFn: async () => {
      console.log('Fetching patient details for preview...');
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', labScript?.patient_id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching patient:', error);
        throw error;
      }

      console.log('Fetched patient:', data);
      return data;
    },
    enabled: !!labScript?.patient_id,
    retry: false
  });

  // Set up real-time subscription for existing lab scripts
  useEffect(() => {
    if (!labScriptId) return;
    
    console.log('Setting up real-time subscription for lab script:', labScriptId);
    
    const channel = supabase
      .channel('lab_script_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lab_scripts',
          filter: `id=eq.${labScriptId}`
        },
        (payload) => {
          console.log('Received real-time update:', payload);
          if (payload.new) {
            setLabScript(payload.new as Tables<"lab_scripts">);
          }
        }
      )
      .subscribe();

    // Initial fetch for existing lab script
    const fetchLabScript = async () => {
      const { data, error } = await supabase
        .from('lab_scripts')
        .select('*')
        .eq('id', labScriptId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching lab script:', error);
        return;
      }

      console.log('Initial lab script fetch:', data);
      setLabScript(data);
    };

    fetchLabScript();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [labScriptId]);

  if (!labScript) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
        <PreviewHeader />
        
        <div className="flex-1 overflow-auto px-6 py-4">
          {isLoadingPatient && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {patientError && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                Unable to load patient information. The patient may have been deleted or you may not have permission to view their details.
              </AlertDescription>
            </Alert>
          )}

          {!isLoadingPatient && !patientError && (
            <PreviewContent labScript={labScript} patient={patient} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};