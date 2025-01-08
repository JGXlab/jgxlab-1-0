import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Calendar, Clock, Building2 } from "lucide-react";

export function PatientTableHeader() {
  return (
    <TableHeader>
      <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-none">
        <TableHead className="text-primary/80 font-semibold">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Patient Name</span>
          </div>
        </TableHead>
        <TableHead className="text-primary/80 font-semibold">
          <div className="flex items-center space-x-2">
            <Building2 className="h-4 w-4" />
            <span>Clinic</span>
          </div>
        </TableHead>
        <TableHead className="text-primary/80 font-semibold">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Gender</span>
          </div>
        </TableHead>
        <TableHead className="text-primary/80 font-semibold">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Date of Birth</span>
          </div>
        </TableHead>
        <TableHead className="text-primary/80 font-semibold">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Created At</span>
          </div>
        </TableHead>
        <TableHead className="text-right text-primary/80 font-semibold">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}