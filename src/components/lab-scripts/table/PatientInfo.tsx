import { User } from "lucide-react";

interface PatientInfoProps {
  patient: {
    first_name?: string;
    last_name?: string;
    id?: string;
  } | null | undefined;
}

export const PatientInfo = ({ patient }: PatientInfoProps) => {
  if (!patient) {
    return (
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
          <User className="h-4 w-4 text-gray-400" />
        </div>
        <div>
          <p className="font-medium text-gray-400">No patient data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
        <User className="h-4 w-4 text-primary" />
      </div>
      <div>
        <p className="font-medium text-gray-900">
          {patient.first_name || 'N/A'} {patient.last_name || ''}
        </p>
        <p className="text-sm text-gray-600">
          ID: {patient.id ? patient.id.slice(0, 8) : 'N/A'}
        </p>
      </div>
    </div>
  );
};