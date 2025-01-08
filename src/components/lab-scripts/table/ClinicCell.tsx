import { TableCell } from "@/components/ui/table";
import { Building2 } from "lucide-react";

interface ClinicCellProps {
  clinicName?: string;
  doctorName?: string;
}

export const ClinicCell = ({ clinicName, doctorName }: ClinicCellProps) => {
  return (
    <TableCell>
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
          <Building2 className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">
            {clinicName || 'N/A'}
          </p>
          <p className="text-sm text-gray-600">
            {doctorName ? `Dr. ${doctorName}` : 'N/A'}
          </p>
        </div>
      </div>
    </TableCell>
  );
};