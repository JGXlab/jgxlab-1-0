import { Table, TableBody } from "@/components/ui/table";
import { PatientTableHeader } from "./table/PatientTableHeader";
import { PatientTableRow } from "./table/PatientTableRow";
import { EmptyPatientTable } from "./table/EmptyPatientTable";

interface PatientsAdminTableProps {
  patients: any[];
  onEdit: (patient: any) => void;
  onDelete: (patient: any) => void;
  onViewHistory: (patient: any) => void;
}

export function PatientsAdminTable({ 
  patients, 
  onEdit, 
  onDelete, 
  onViewHistory 
}: PatientsAdminTableProps) {
  if (!patients?.length) {
    return (
      <Table>
        <PatientTableHeader />
        <TableBody>
          <EmptyPatientTable />
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <PatientTableHeader />
      <TableBody>
        {patients.map((patient) => (
          <PatientTableRow
            key={patient.id}
            patient={patient}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewHistory={onViewHistory}
          />
        ))}
      </TableBody>
    </Table>
  );
}