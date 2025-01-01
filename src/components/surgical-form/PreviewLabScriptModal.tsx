import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { z } from "zod";
import { formSchema } from "./formSchema";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface PreviewLabScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: z.infer<typeof formSchema>;
}

export const PreviewLabScriptModal = ({
  isOpen,
  onClose,
  formData,
}: PreviewLabScriptModalProps) => {
  const [labScript, setLabScript] = useState<any>(formData);

  const formatTreatmentType = (value: string | undefined) => {
    if (!value) return 'Not specified';
    
    if (!value.includes('|')) return value;
    
    const [upper, lower] = value.split('|');
    if (!upper && !lower) return 'Not specified';
    if (upper && lower) return `Upper: ${upper}, Lower: ${lower}`;
    if (upper) return `Upper: ${upper}`;
    return `Lower: ${lower}`;
  };

  const formatApplianceType = (type: string | undefined) => {
    if (!type) return 'Not specified';
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Fetch patient details
  const { data: patient } = useQuery({
    queryKey: ['patient', labScript.patient_id],
    queryFn: async () => {
      console.log('Fetching patient details for preview...');
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', labScript.patient_id)
        .single();

      if (error) {
        console.error('Error fetching patient:', error);
        throw error;
      }

      console.log('Fetched patient:', data);
      return data;
    },
    enabled: !!labScript.patient_id
  });

  // Set up real-time subscription
  useEffect(() => {
    console.log('Setting up real-time subscription for lab script:', formData.id);
    
    const channel = supabase
      .channel('lab_script_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lab_scripts',
          filter: `id=eq.${formData.id}`
        },
        (payload) => {
          console.log('Received real-time update:', payload);
          if (payload.new) {
            setLabScript(payload.new);
          }
        }
      )
      .subscribe();

    // Initial fetch
    const fetchLabScript = async () => {
      const { data, error } = await supabase
        .from('lab_scripts')
        .select('*')
        .eq('id', formData.id)
        .single();

      if (error) {
        console.error('Error fetching lab script:', error);
        return;
      }

      console.log('Initial lab script fetch:', data);
      setLabScript(data);
    };

    if (formData.id) {
      fetchLabScript();
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [formData.id]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Lab Script Preview</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] pr-4">
          <div className="space-y-6">
            {/* Patient Information */}
            <div>
              <h3 className="text-lg font-medium mb-4">Patient Information</h3>
              <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <PreviewField 
                  label="Patient Name" 
                  value={patient ? `${patient.first_name} ${patient.last_name}` : 'Loading...'} 
                />
                <PreviewField 
                  label="Gender" 
                  value={patient?.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'Loading...'} 
                />
                <PreviewField 
                  label="Submitted Date" 
                  value={format(new Date(labScript.created_at || new Date()), 'MMM d, yyyy')} 
                />
                <PreviewField 
                  label="Due Date" 
                  value={labScript.due_date || 'Not specified'} 
                />
              </div>
            </div>

            {/* Appliance Details */}
            <div>
              <h3 className="text-lg font-medium mb-4">Appliance Details</h3>
              <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <PreviewField 
                  label="Appliance Type" 
                  value={formatApplianceType(labScript.appliance_type)} 
                />
                <PreviewField 
                  label="Arch Type" 
                  value={labScript.arch ? labScript.arch.charAt(0).toUpperCase() + labScript.arch.slice(1) : 'Not specified'} 
                />
                <PreviewField 
                  label="Treatment Type" 
                  value={formatTreatmentType(labScript.treatment_type)} 
                />
                <PreviewField 
                  label="Screw Type" 
                  value={labScript.screw_type === 'others' && labScript.other_screw_type 
                    ? labScript.other_screw_type 
                    : labScript.screw_type || 'Not specified'} 
                />
                <PreviewField 
                  label="VDO Details" 
                  value={labScript.vdo_details || 'Not specified'} 
                />
                <PreviewField 
                  label="Needs Nightguard" 
                  value={labScript.needs_nightguard 
                    ? labScript.needs_nightguard.charAt(0).toUpperCase() + labScript.needs_nightguard.slice(1)
                    : 'Not specified'} 
                />
                <PreviewField 
                  label="Shade" 
                  value={labScript.shade ? labScript.shade.toUpperCase() : 'Not specified'} 
                />
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-medium mb-4">Additional Information</h3>
              <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                {labScript.specific_instructions && (
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium text-muted-foreground">Specific Instructions</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {labScript.specific_instructions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const PreviewField = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1.5">
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p className="text-sm text-foreground">{value}</p>
  </div>
);