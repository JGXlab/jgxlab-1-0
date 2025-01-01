import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreVertical } from "lucide-react";
import { format } from "date-fns";
import { StatusUpdateButtons } from "./StatusUpdateButtons";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";

interface LabScript {
  id: string;
  patients: {
    first_name: string;
    last_name: string;
  };
  user_id: string;
  clinics: {
    name: string;
    doctor_name: string;
  } | null;
  treatment_type: string;
  appliance_type: string;
  due_date: string;
  status: string;
  created_at: string;
  arch: string;
}

interface LabScriptsTableProps {
  labScripts: LabScript[];
  onPreview: (script: LabScript, e: React.MouseEvent) => void;
  onStatusUpdate: (id: string, status: string) => void;
}

export const LabScriptsTable = ({ labScripts, onPreview, onStatusUpdate }: LabScriptsTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-orange-100 text-orange-800';
      case 'on_hold':
        return 'bg-red-100 text-red-800';
      case 'incomplete':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient Name</TableHead>
            <TableHead>Clinic</TableHead>
            <TableHead>Appliance Type</TableHead>
            <TableHead>Request Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Treatments</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Update Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {labScripts.map((script) => (
            <TableRow key={script.id} className="hover:bg-gray-50">
              <TableCell className="font-medium text-primary">
                {script.patients?.first_name} {script.patients?.last_name}
              </TableCell>
              <TableCell className="text-gray-600">
                {script.clinics?.name || 'N/A'}
                {script.clinics?.doctor_name && (
                  <div className="text-sm text-gray-500">
                    Dr. {script.clinics.doctor_name}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-primary">{script.appliance_type}</TableCell>
              <TableCell>{format(new Date(script.created_at), 'MMM dd, yyyy')}</TableCell>
              <TableCell>{script.due_date}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div>
                    <span className="font-medium">Upper:</span> {script.arch}
                  </div>
                  <div>
                    <span className="font-medium">Lower:</span> {script.arch}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(script.status)}>
                  {script.status}
                </Badge>
              </TableCell>
              <TableCell>
                <StatusUpdateButtons 
                  script={script}
                  onStatusUpdate={onStatusUpdate}
                />
              </TableCell>
              <TableCell>
                <ContextMenu>
                  <ContextMenuTrigger>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </ContextMenuTrigger>
                  <ContextMenuContent align="end" className="w-[160px]">
                    <ContextMenuItem
                      className="cursor-pointer"
                      onClick={(e) => onPreview(script, e)}
                    >
                      <span>Edit</span>
                    </ContextMenuItem>
                    <ContextMenuItem
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <span>Delete</span>
                    </ContextMenuItem>
                  </ContextMenuContent>
                </ContextMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};