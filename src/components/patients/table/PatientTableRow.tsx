import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { PatientActions } from "../PatientActions";

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
      <TableCell>
        <Badge 
          variant="secondary" 
          className="capitalize bg-accent text-accent-foreground"
        >
          {patient.gender}
        </Badge>
      </TableCell>
      <TableCell className="text-gray-600">
        {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : 'Not set'}
      </TableCell>
      <TableCell className="text-gray-600">
        {new Date(patient.created_at).toLocaleDateString()}
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