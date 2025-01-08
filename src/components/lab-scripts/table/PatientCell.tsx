import { TableCell } from "@/components/ui/table";
import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

interface PatientCellProps {
  firstName: string;
  lastName: string;
  patientId: string;
  expressDesign?: string;
}

export const PatientCell = ({ firstName, lastName, patientId, expressDesign }: PatientCellProps) => {
  return (
    <TableCell>
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="h-4 w-4 text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900">
              {firstName} {lastName}
            </p>
            {expressDesign === 'yes' && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                <Package className="h-3 w-3 mr-1" />
                Express
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600">
            ID: {patientId.slice(0, 8)}
          </p>
        </div>
      </div>
    </TableCell>
  );
};