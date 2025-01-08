import { TableCell, TableRow } from "@/components/ui/table";

interface EmptyPatientTableProps {
  searchTerm?: string;
}

export function EmptyPatientTable({ searchTerm }: EmptyPatientTableProps) {
  return (
    <TableRow>
      <TableCell colSpan={6} className="h-32 text-center">
        <div className="flex flex-col items-center justify-center space-y-1">
          <div className="text-lg font-medium text-gray-900">
            {searchTerm 
              ? "No patients found matching your search." 
              : "No patients found"}
          </div>
          <div className="text-sm text-gray-500">
            {searchTerm 
              ? "Try adjusting your search term."
              : "Add your first patient to get started."}
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}