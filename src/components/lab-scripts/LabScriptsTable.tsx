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
        return 'bg-amber-100/10 dark:bg-amber-900/20 text-amber-800 dark:text-amber-100';
      case 'completed':
        return 'bg-green-100/10 dark:bg-green-900/20 text-green-800 dark:text-green-100';
      case 'in_progress':
        return 'bg-blue-100/10 dark:bg-blue-900/20 text-blue-800 dark:text-blue-100';
      case 'paused':
        return 'bg-orange-100/10 dark:bg-orange-900/20 text-orange-800 dark:text-orange-100';
      case 'on_hold':
        return 'bg-red-100/10 dark:bg-red-900/20 text-red-800 dark:text-red-100';
      case 'incomplete':
        return 'bg-pink-100/10 dark:bg-pink-900/20 text-pink-800 dark:text-pink-100';
      default:
        return 'bg-gray-100/10 dark:bg-gray-800/20 text-gray-800 dark:text-gray-100';
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50">
            <TableHead className="text-foreground/70 dark:text-white/70">Patient Name</TableHead>
            <TableHead className="text-foreground/70 dark:text-white/70">Clinic</TableHead>
            <TableHead className="text-foreground/70 dark:text-white/70">Appliance Type</TableHead>
            <TableHead className="text-foreground/70 dark:text-white/70">Request Date</TableHead>
            <TableHead className="text-foreground/70 dark:text-white/70">Due Date</TableHead>
            <TableHead className="text-foreground/70 dark:text-white/70">Status</TableHead>
            <TableHead className="text-foreground/70 dark:text-white/70">Update Status</TableHead>
            <TableHead className="text-right text-foreground/70 dark:text-white/70">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {labScripts.map((script) => (
            <TableRow key={script.id} className="hover:bg-muted/50 dark:hover:bg-muted/10 border-border/50">
              <TableCell className="font-medium text-primary dark:text-white">
                {script.patients?.first_name} {script.patients?.last_name}
              </TableCell>
              <TableCell>
                <div className="text-foreground/90 dark:text-white/90">
                  {script.clinics?.name || 'N/A'}
                </div>
                {script.clinics?.doctor_name && (
                  <div className="text-sm text-muted-foreground dark:text-white/70">
                    Dr. {script.clinics.doctor_name}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-primary/90 dark:text-white/90">{script.appliance_type}</TableCell>
              <TableCell className="text-foreground/90 dark:text-white/90">{format(new Date(script.created_at), 'MMM dd, yyyy')}</TableCell>
              <TableCell className="text-foreground/90 dark:text-white/90">{script.due_date}</TableCell>
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
                    className="flex items-center gap-2 hover:bg-muted/50 dark:hover:bg-muted/20 text-foreground/90 dark:text-white/90"
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