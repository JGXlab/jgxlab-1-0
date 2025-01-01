import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { z } from "zod";
import { formSchema } from "./formSchema";

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Lab Script Preview</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <PreviewField label="Appliance Type" value={formData.applianceType} />
            <PreviewField label="Arch" value={formData.arch} />
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
              <PreviewField label="VDO Details" value={formData.vdoDetails} />
            )}
            {formData.needsNightguard && (
              <PreviewField label="Needs Nightguard" value={formData.needsNightguard} />
            )}
            {formData.shade && (
              <PreviewField label="Shade" value={formData.shade} />
            )}
            <PreviewField 
              label="Due Date" 
              value={formData.dueDate} 
            />
            {formData.specificInstructions && (
              <div className="col-span-2">
                <PreviewField 
                  label="Specific Instructions" 
                  value={formData.specificInstructions} 
                />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PreviewField = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-sm text-gray-900">{value}</p>
  </div>
);