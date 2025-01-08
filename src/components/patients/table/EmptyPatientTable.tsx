import { TableCell, TableRow } from "@/components/ui/table";

interface EmptyPatientTableProps {
  searchTerm: string;
}

export function EmptyPatientTable({ searchTerm }: EmptyPatientTableProps) {
  return (
    <TableRow>
      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
        {searchTerm 
          ? "No patients found matching your search." 
          : "No patients found. Add your first patient to get started."}
      </TableCell>
    </TableRow>
  );
}