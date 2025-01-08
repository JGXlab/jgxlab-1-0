import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { User, Building2 } from "lucide-react";
import { PatientActions } from "../PatientActions";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
  const isClinicPortal = location.pathname.startsWith('/clinic');
  const clinicName = patient.clinics?.name;

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
            <p className="text-sm text-gray-600">
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
            <span className="text-gray-900">{clinicName || 'N/A'}</span>
          </div>
        </TableCell>
      )}
      <TableCell>
        <Badge 
          variant="secondary" 
          className="bg-accent text-accent-foreground capitalize"
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