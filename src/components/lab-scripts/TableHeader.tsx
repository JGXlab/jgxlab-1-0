import { TableHead, TableHeader as TableHeaderUI, TableRow } from "@/components/ui/table";
import { User, FileText, Calendar, Database, CreditCard, Clock } from "lucide-react";

export const TableHeader = () => {
  return (
    <TableHeaderUI>
      <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-none">
        <TableHead className="text-primary/80 font-semibold">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Patient</span>
          </div>
        </TableHead>
        <TableHead className="text-primary/80 font-semibold">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Appliance Details</span>
          </div>
        </TableHead>
        <TableHead className="text-primary/80 font-semibold">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Due Date</span>
          </div>
        </TableHead>
        <TableHead className="text-primary/80 font-semibold">
          <div className="flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Status</span>
          </div>
        </TableHead>
        <TableHead className="text-primary/80 font-semibold">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Payment</span>
          </div>
        </TableHead>
        <TableHead className="text-primary/80 font-semibold">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Created</span>
          </div>
        </TableHead>
        <TableHead className="text-right text-primary/80 font-semibold">
          <span>Actions</span>
        </TableHead>
      </TableRow>
    </TableHeaderUI>
  );
};