import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { StatusUpdateButtons } from "./StatusUpdateButtons";
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
        return 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100';
      case 'completed':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100';
      case 'in_progress':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100';
      case 'paused':
        return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-100';
      case 'on_hold':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100';
      case 'incomplete':
        return 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-100';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100';
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
            <TableHead>Status</TableHead>
            <TableHead>Update Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {labScripts.map((script) => (
            <TableRow key={script.id} className="hover:bg-muted/50 dark:hover:bg-muted/20">
              <TableCell className="font-medium text-primary dark:text-primary-foreground">
                {script.patients?.first_name} {script.patients?.last_name}
              </TableCell>
              <TableCell>
                <div className="text-foreground">
                  {script.clinics?.name || 'N/A'}
                </div>
                {script.clinics?.doctor_name && (
                  <div className="text-sm text-muted-foreground">
                    Dr. {script.clinics.doctor_name}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-primary dark:text-primary-foreground">{script.appliance_type}</TableCell>
              <TableCell className="text-foreground">{format(new Date(script.created_at), 'MMM dd, yyyy')}</TableCell>
              <TableCell className="text-foreground">{script.due_date}</TableCell>
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
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 hover:bg-muted/50 dark:hover:bg-muted/20"
                    onClick={(e) => onPreview(script, e)}
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};