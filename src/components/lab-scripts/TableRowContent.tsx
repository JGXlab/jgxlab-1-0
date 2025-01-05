import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Eye, Receipt, Building2 } from "lucide-react";
import { format } from "date-fns";
import { getStatusColor, getPaymentStatusColor } from "./utils/statusStyles";
import { StatusUpdateButtons } from "./StatusUpdateButtons";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Invoice } from "./payment/Invoice";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TableRowContentProps {
  script: any;
  onPreview: (script: any, e: React.MouseEvent) => void;
  onStatusUpdate?: (id: string, status: string) => void;
}

export const TableRowContent = ({ script, onPreview, onStatusUpdate }: TableRowContentProps) => {
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);

  const handleViewInvoice = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowInvoiceDialog(true);
  };

  return (
    <>
      <TableRow className="hover:bg-gray-50/50 transition-colors duration-200">
        <TableCell>
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {script.patients?.first_name} {script.patients?.last_name}
              </p>
              <p className="text-sm text-gray-600">
                ID: {script.patient_id.slice(0, 8)}
              </p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {script.patients?.clinics?.name || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                Dr. {script.patients?.clinics?.doctor_name || 'N/A'}
              </p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="space-y-1">
            <p className="font-medium text-gray-900">
              {script.appliance_type}
            </p>
            <p className="text-sm text-gray-600">
              {script.arch.charAt(0).toUpperCase() + script.arch.slice(1)} Arch
            </p>
          </div>
        </TableCell>
        <TableCell>
          <div className="text-sm text-gray-600">
            {script.due_date}
          </div>
        </TableCell>
        <TableCell>
          <Badge 
            variant="secondary"
            className={`flex items-center gap-1 w-fit ${getStatusColor(script.status)}`}
          >
            <span className="capitalize">{script.status}</span>
          </Badge>
        </TableCell>
        <TableCell>
          <Badge 
            variant="secondary"
            className={`flex items-center gap-1 w-fit ${getPaymentStatusColor(script.payment_status)}`}
          >
            <span className="capitalize">{script.payment_status}</span>
          </Badge>
        </TableCell>
        <TableCell>
          <div className="text-sm text-gray-600">
            {format(new Date(script.created_at), 'MMM d, yyyy')}
          </div>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-2">
            {onStatusUpdate && (
              <StatusUpdateButtons script={script} onStatusUpdate={onStatusUpdate} />
            )}
            {script.payment_status === 'paid' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleViewInvoice}
                className="h-8 w-8 rounded-full text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200 transition-all duration-300 hover:scale-105 group relative"
              >
                <Receipt className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                <span className="sr-only">View Invoice</span>
                <span className="absolute -bottom-8 scale-0 transition-all duration-200 group-hover:scale-100 text-xs bg-gray-900 text-white px-2 py-1 rounded whitespace-nowrap">
                  View Invoice
                </span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => onPreview(script, e)}
              className="h-8 w-8 rounded-full text-primary hover:text-primary hover:bg-primary/10 border-primary/20 transition-all duration-300 hover:scale-105 group relative"
            >
              <Eye className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              <span className="sr-only">Preview</span>
              <span className="absolute -bottom-8 scale-0 transition-all duration-200 group-hover:scale-100 text-xs bg-gray-900 text-white px-2 py-1 rounded whitespace-nowrap">
                Preview Script
              </span>
            </Button>
          </div>
        </TableCell>
      </TableRow>

      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0">
          <DialogHeader className="px-2 py-1 border-b">
            <DialogTitle>Invoice Preview</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 h-full">
            <div className="p-6">
              <Invoice labScript={script} />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};