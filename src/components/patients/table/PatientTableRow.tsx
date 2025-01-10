import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { User, Building2 } from "lucide-react";
import { PatientActions } from "@/components/patients/PatientActions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PatientTableRowProps {
  patient: any;
  onEdit: (patient: any) => void;
  onDelete: (patient: any) => void;
  onViewHistory: (patient: any) => void;
}

export function PatientTableRow({ 
  patient, 
  onEdit, 
  onDelete, 
  onViewHistory 
}: PatientTableRowProps) {
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return profile;
    }
  });

  const isClinicPortal = userProfile?.role === 'clinic';

  return (
    <TableRow className="hover:bg-gray-50/50 transition-colors duration-200">
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {patient.first_name} {patient.last_name}
            </p>
            <p className="text-sm text-gray-500">
              ID: {patient.id.slice(0, 8)}
            </p>
          </div>
        </div>
      </TableCell>
      {!isClinicPortal && (
        <TableCell>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {patient.clinics?.name || 'No clinic assigned'}
              </p>
              <p className="text-sm text-gray-600">
                {patient.clinics?.doctor_name && patient.clinics.doctor_name !== '' 
                  ? `Dr. ${patient.clinics.doctor_name}` 
                  : 'No doctor assigned'}
              </p>
            </div>
          </div>
        </TableCell>
      )}
      <TableCell>
        <Badge 
          variant="secondary" 
          className={`
            ${patient.gender.toLowerCase() === 'male' 
              ? 'bg-blue-50 text-blue-600' 
              : 'bg-pink-50 text-pink-600'} 
            border-none capitalize px-3 py-1
          `}
        >
          {patient.gender}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="text-sm text-gray-600">
          {patient.date_of_birth ? format(new Date(patient.date_of_birth), 'MMM d, yyyy') : 'Not set'}
        </div>
      </TableCell>
      <TableCell>
        <div className="text-sm text-gray-600">
          {format(new Date(patient.created_at), 'MMM d, yyyy')}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <PatientActions
          onEdit={() => onEdit(patient)}
          onDelete={() => onDelete(patient)}
          onViewHistory={() => onViewHistory(patient)}
        />
      </TableCell>
    </TableRow>
  );
}