import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PatientActions } from "@/components/patients/PatientActions";

interface PatientsAdminTableProps {
  patients: any[];
  onEdit: (patient: any) => void;
  onDelete: (patient: any) => void;
  onViewHistory: (patient: any) => void;
}

export const PatientsAdminTable = ({ 
  patients,
  onEdit,
  onDelete,
  onViewHistory
}: PatientsAdminTableProps) => {
  if (!patients?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-gray-400">
        <Users className="w-12 h-12 mb-4 text-gray-300" />
        <p className="text-gray-500 font-medium">No patients found</p>
        <p className="text-sm text-gray-400">
          Try adjusting your search terms
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/5 hover:bg-muted/5">
          <TableHead className="text-primary/80 font-semibold">Name</TableHead>
          <TableHead className="text-primary/80 font-semibold">Gender</TableHead>
          <TableHead className="text-primary/80 font-semibold">Clinic</TableHead>
          <TableHead className="text-primary/80 font-semibold">Created At</TableHead>
          <TableHead className="text-primary/80 font-semibold text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((patient) => (
          <TableRow key={patient.id} className="hover:bg-muted/5">
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">
                    {patient.first_name} {patient.last_name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ID: {patient.id.slice(0, 8)}
                  </span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className="capitalize">
                {patient.gender}
              </Badge>
            </TableCell>
            <TableCell>{patient.clinics?.name || 'No clinic assigned'}</TableCell>
            <TableCell className="text-muted-foreground">
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
        ))}
      </TableBody>
    </Table>
  );
};