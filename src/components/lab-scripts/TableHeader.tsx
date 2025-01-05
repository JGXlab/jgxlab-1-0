import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, FileText, Calendar } from "lucide-react";

interface LabScriptsTableHeaderProps {
  isDesignPortal?: boolean;
  hideClinicColumn?: boolean;
}

export const LabScriptsTableHeader = ({ 
  isDesignPortal = false,
  hideClinicColumn = false 
}: LabScriptsTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-none">
        <TableHead className="text-primary/80 font-semibold">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Patient</span>
          </div>
        </TableHead>
        {!hideClinicColumn && (
          <TableHead className="text-primary/80 font-semibold">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Appliance Details</span>
            </div>
          </TableHead>
        )}
        <TableHead className="text-primary/80 font-semibold">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Due Date</span>
          </div>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};