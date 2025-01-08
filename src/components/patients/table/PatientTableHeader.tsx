import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Calendar, Clock } from "lucide-react";

export function PatientTableHeader() {
  return (
    <TableHeader>
      <TableRow className="border-b border-gray-100 hover:bg-transparent">
        <TableHead className="text-gray-500 font-medium">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Patient Name</span>
          </div>
        </TableHead>
        <TableHead className="text-gray-500 font-medium">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Gender</span>
          </div>
        </TableHead>
        <TableHead className="text-gray-500 font-medium">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Date of Birth</span>
          </div>
        </TableHead>
        <TableHead className="text-gray-500 font-medium">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Created At</span>
          </div>
        </TableHead>
        <TableHead className="text-right text-gray-500 font-medium">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}