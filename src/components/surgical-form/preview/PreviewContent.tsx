import { ScrollArea } from "@/components/ui/scroll-area";
import { PatientSection } from "./PatientSection";
import { ApplianceSection } from "./ApplianceSection";
import { InstructionsSection } from "./InstructionsSection";
import { PaymentSection } from "./PaymentSection";
import { Tables } from "@/integrations/supabase/types";

interface PreviewContentProps {
  labScript: Tables<"lab_scripts">;
  patient: Tables<"patients"> | null;
}

export const PreviewContent = ({ labScript, patient }: PreviewContentProps) => {
  return (
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
          expressDesign={labScript.express_design}
        />
        <InstructionsSection 
          instructions={labScript.specific_instructions}
        />
        <PaymentSection 
          labScript={labScript}
        />
      </div>
    </ScrollArea>
  );
};