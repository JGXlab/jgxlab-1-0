import { format } from "date-fns";
import { PreviewField } from "./PreviewField";
import { Tables } from "@/integrations/supabase/types";

interface PatientSectionProps {
  patient: Tables<"patients"> | null;
  createdAt: string;
  dueDate: string;
}

export const PatientSection = ({ patient, createdAt, dueDate }: PatientSectionProps) => (
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
        value={format(new Date(createdAt), 'MMM d, yyyy')} 
      />
      <PreviewField 
        label="Due Date" 
        value={dueDate || 'Not specified'} 
      />
    </div>
  </div>
);