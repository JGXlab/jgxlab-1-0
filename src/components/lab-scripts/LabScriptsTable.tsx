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
    clinic_id: string | null;
    clinics: {
      name: string;
      doctor_name: string;
    } | null;
  };
  user_id: string;
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
            <TableHead>Status</TableHead>
            <TableHead>Update Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {labScripts.map((script) => (
            <TableRow key={script.id} className="hover:bg-gray-50">
              <TableCell className="font-medium text-primary">
                {script.patients?.first_name} {script.patients?.last_name}
              </TableCell>
              <TableCell>
                {script.patients?.clinics ? (
                  <div>
                    <div className="text-gray-900">{script.patients.clinics.name}</div>
                    {script.patients.clinics.doctor_name && (
                      <div className="text-sm text-gray-500">
                        Dr. {script.patients.clinics.doctor_name}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-500">No clinic assigned</span>
                )}
              </TableCell>
              <TableCell className="text-primary">{script.appliance_type}</TableCell>
              <TableCell>{format(new Date(script.created_at), 'MMM dd, yyyy')}</TableCell>
              <TableCell>{script.due_date}</TableCell>
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
                    className="flex items-center gap-2 hover:bg-gray-100"
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