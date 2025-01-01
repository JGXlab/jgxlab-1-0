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
import { z } from "zod";
import { formSchema } from "./formSchema";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { pdf } from '@react-pdf/renderer';
import { LabScriptPDF } from "./preview/LabScriptPDF";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  const [labScript, setLabScript] = useState<Tables<"lab_scripts"> | null>(null);

  // If we have formData, transform it to match lab_scripts table structure
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

  const handleDownload = async () => {
    if (!labScript || !patient) {
      toast({
        title: "Error",
        description: "Cannot generate PDF: missing lab script or patient data",
        variant: "destructive",
      });
      return;
    }

    try {
      const blob = await pdf(<LabScriptPDF labScript={labScript} patient={patient} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `lab-script-${labScript.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Lab script PDF has been downloaded",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  if (!labScript) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-semibold text-gray-900">Lab Script Preview</DialogTitle>
          <Button
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Save as PDF
          </Button>
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