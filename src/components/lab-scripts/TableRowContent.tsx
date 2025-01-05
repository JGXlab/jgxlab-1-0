import { TableCell, TableRow } from "@/components/ui/table";
import { User } from "lucide-react";

interface TableRowContentProps {
  script: any;
  onPreview: (script: any, e: React.MouseEvent) => void;
  isDesignPortal?: boolean;
  hideClinicColumn?: boolean;
}

export const TableRowContent = ({ 
  script, 
  onPreview,
  isDesignPortal = false,
  hideClinicColumn = false
}: TableRowContentProps) => {
  return (
    <TableRow className="hover:bg-gray-50/50 transition-colors duration-200">
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {script.patients?.first_name} {script.patients?.last_name}
            </p>
            <p className="text-sm text-gray-600">
              {script.patients?.clinics?.name || 'N/A'}
            </p>
          </div>
        </div>
      </TableCell>
      {!hideClinicColumn && (
        <TableCell>
          <div className="space-y-1">
            <p className="font-medium text-gray-900">
              {script.appliance_type}
            </p>
            <p className="text-sm text-gray-600">
              {script.arch.charAt(0).toUpperCase() + script.arch.slice(1)} Arch
            </p>
          </div>
        </TableCell>
      )}
      <TableCell>
        <div className="text-sm text-gray-600">
          {script.due_date}
        </div>
      </TableCell>
    </TableRow>
  );
};