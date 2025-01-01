import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { PatientSection } from "./preview/PatientSection";
import { ApplianceSection } from "./preview/ApplianceSection";
import { InstructionsSection } from "./preview/InstructionsSection";
import { Tables } from "@/integrations/supabase/types";

interface PreviewLabScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  labScriptId?: string;
}

export const PreviewLabScriptModal = ({
  isOpen,
  onClose,
  labScriptId,
}: PreviewLabScriptModalProps) => {
  const [labScript, setLabScript] = useState<Tables<"lab_scripts"> | null>(null);

  // Fetch patient details
  const { data: patient } = useQuery({
    queryKey: ['patient', labScript?.patient_id],
    queryFn: async () => {
      console.log('Fetching patient details for preview...');
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', labScript?.patient_id)
        .single();

      if (error) {
        console.error('Error fetching patient:', error);
        throw error;
      }

      console.log('Fetched patient:', data);
      return data;
    },
    enabled: !!labScript?.patient_id
  });

  // Set up real-time subscription
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

    // Initial fetch
    const fetchLabScript = async () => {
      const { data, error } = await supabase
        .from('lab_scripts')
        .select('*')
        .eq('id', labScriptId)
        .single();

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
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">Lab Script Preview</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] pr-6">
          <div className="space-y-8 py-4">
            <PatientSection 
              patient={patient}
              createdAt={labScript.created_at}
              dueDate={labScript.due_date}
            />
            <ApplianceSection 
              applianceType={labScript.appliance_type}
              arch={labScript.arch}
              treatmentType={labScript.treatment_type}
              screwType={labScript.screw_type || ''}
              otherScrewType={labScript.other_screw_type}
              vdoDetails={labScript.vdo_details || ''}
              needsNightguard={labScript.needs_nightguard || ''}
              shade={labScript.shade || ''}
            />
            <InstructionsSection 
              instructions={labScript.specific_instructions}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};