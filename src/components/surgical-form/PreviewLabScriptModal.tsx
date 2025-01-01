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
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  const formatTreatmentType = (value: string | undefined) => {
    if (!value) return 'Not specified';
    
    // Handle cases where the value might not contain the separator
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
    queryKey: ['patient', formData.patientId],
    queryFn: async () => {
      console.log('Fetching patient details for preview...');
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', formData.patientId)
        .single();

      if (error) {
        console.error('Error fetching patient:', error);
        throw error;
      }

      console.log('Fetched patient:', data);
      return data;
    },
    enabled: !!formData.patientId
  });

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
              </div>
            </div>

            {/* Appliance Details */}
            <div>
              <h3 className="text-lg font-medium mb-4">Appliance Details</h3>
              <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <PreviewField 
                  label="Appliance Type" 
                  value={formatApplianceType(formData.applianceType)} 
                />
                <PreviewField 
                  label="Arch Type" 
                  value={formData.arch ? formData.arch.charAt(0).toUpperCase() + formData.arch.slice(1) : 'Not specified'} 
                />
                <PreviewField 
                  label="Treatment Type" 
                  value={formatTreatmentType(formData.treatmentType)} 
                />
                {formData.screwType && (
                  <PreviewField 
                    label="Screw Type" 
                    value={formData.otherScrewType && formData.screwType === 'others' 
                      ? formData.otherScrewType 
                      : formData.screwType} 
                  />
                )}
                {formData.vdoDetails && (
                  <PreviewField 
                    label="VDO Details" 
                    value={formData.vdoDetails} 
                  />
                )}
                {formData.needsNightguard && (
                  <PreviewField 
                    label="Needs Nightguard" 
                    value={formData.needsNightguard} 
                  />
                )}
                {formData.shade && (
                  <PreviewField 
                    label="Shade" 
                    value={formData.shade.toUpperCase()} 
                  />
                )}
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-medium mb-4">Additional Information</h3>
              <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                <PreviewField 
                  label="Due Date" 
                  value={formData.dueDate} 
                />
                {formData.specificInstructions && (
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium text-muted-foreground">Specific Instructions</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {formData.specificInstructions}
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