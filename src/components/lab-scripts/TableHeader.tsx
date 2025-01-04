import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, FileText, Calendar, Database, CreditCard, Clock } from "lucide-react";

export const LabScriptsTableHeader = () => {
  return (
    <TableHeader>
      <TableRow className="bg-gray-50/50">
        <TableHead className="w-[250px]">
          <div className="flex items-center space-x-2 text-gray-700">
            <User className="h-4 w-4" />
            <span>Patient</span>
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center space-x-2 text-gray-700">
            <FileText className="h-4 w-4" />
            <span>Appliance Details</span>
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center space-x-2 text-gray-700">
            <Calendar className="h-4 w-4" />
            <span>Due Date</span>
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center space-x-2 text-gray-700">
            <Database className="h-4 w-4" />
            <span>Status</span>
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center space-x-2 text-gray-700">
            <CreditCard className="h-4 w-4" />
            <span>Payment</span>
          </div>
        </TableHead>
        <TableHead>
          <div className="flex items-center space-x-2 text-gray-700">
            <Clock className="h-4 w-4" />
            <span>Created</span>
          </div>
        </TableHead>
        <TableHead className="w-[100px]">
          <span className="sr-only">Actions</span>
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};