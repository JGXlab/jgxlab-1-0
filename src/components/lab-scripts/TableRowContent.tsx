import { TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TableRowContentProps {
  script: any;
  onPreview: (script: any, e: React.MouseEvent) => void;
  onStatusUpdate?: (id: string, status: string) => void;
  isDesignPortal?: boolean;
  hideClinicColumn?: boolean;
}

export const TableRowContent = ({ 
  script, 
  onPreview,
  onStatusUpdate,
  isDesignPortal = false,
  hideClinicColumn = false
}: TableRowContentProps) => {
  const patientName = `${script.patients?.first_name || ''} ${script.patients?.last_name || ''}`;
  const clinicName = script.patients?.clinics?.name || '';
  
  if (isDesignPortal) {
    return (
      <TableRow 
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={(e) => onPreview(script, e)}
      >
        <TableCell className="font-medium">{patientName}</TableCell>
        {!hideClinicColumn && <TableCell>{clinicName}</TableCell>}
        <TableCell>{script.appliance_type}</TableCell>
        <TableCell>{format(new Date(script.due_date), 'MMM dd, yyyy')}</TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{patientName}</TableCell>
      <TableCell>{clinicName}</TableCell>
      <TableCell>{script.appliance_type}</TableCell>
      <TableCell>{format(new Date(script.due_date), 'MMM dd, yyyy')}</TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={`
            ${script.status === 'pending' && 'border-purple-500 text-purple-500'}
            ${script.status === 'in_progress' && 'border-yellow-500 text-yellow-500'}
            ${script.status === 'completed' && 'border-green-500 text-green-500'}
            ${script.status === 'paused' && 'border-orange-500 text-orange-500'}
            ${script.status === 'on_hold' && 'border-red-500 text-red-500'}
            ${script.status === 'incomplete' && 'border-gray-500 text-gray-500'}
          `}
        >
          {script.status.replace('_', ' ')}
        </Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => onPreview(script, e)}>
              Preview
            </DropdownMenuItem>
            {onStatusUpdate && (
              <>
                <DropdownMenuItem onClick={() => onStatusUpdate(script.id, 'in_progress')}>
                  Mark In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusUpdate(script.id, 'completed')}>
                  Mark Completed
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};