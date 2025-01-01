import { format } from "date-fns";
import { PreviewField } from "./PreviewField";
import { Tables } from "@/integrations/supabase/types";

interface PatientSectionProps {
  patient: Tables<"patients"> | null;
  createdAt: string;
  dueDate: string;
}

export const PatientSection = ({ patient, createdAt, dueDate }: PatientSectionProps) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-lg border border-gray-100">
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