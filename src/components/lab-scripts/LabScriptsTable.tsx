import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { StatusUpdateButtons } from "./StatusUpdateButtons";

interface LabScript {
  id: string;
  patients: {
    first_name: string;
    last_name: string;
  };
  treatment_type: string;
  appliance_type: string;
  due_date: string;
  status: string;
  created_at: string;
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
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-orange-100 text-orange-800';
      case 'on_hold':
        return 'bg-purple-100 text-purple-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient Name</TableHead>
          <TableHead>Treatment Type</TableHead>
          <TableHead>Appliance Type</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>Actions</TableHead>
          <TableHead>Status Update</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {labScripts.map((script) => (
          <TableRow key={script.id} className="hover:bg-gray-50">
            <TableCell className="font-medium">
              {script.patients?.first_name} {script.patients?.last_name}
            </TableCell>
            <TableCell>{script.treatment_type}</TableCell>
            <TableCell>{script.appliance_type}</TableCell>
            <TableCell>{script.due_date}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(script.status)}>
                {script.status}
              </Badge>
            </TableCell>
            <TableCell className="text-gray-500">
              {format(new Date(script.created_at), 'MMM d, yyyy')}
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="sm"
                className="w-full flex items-center justify-center gap-2"
                onClick={(e) => onPreview(script, e)}
              >
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </Button>
            </TableCell>
            <TableCell>
              <StatusUpdateButtons 
                script={script}
                onStatusUpdate={onStatusUpdate}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};