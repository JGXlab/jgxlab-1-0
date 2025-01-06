import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Eye, Receipt, Building2, MoreVertical, Printer } from "lucide-react";
import { format } from "date-fns";
import { getStatusColor, getPaymentStatusColor } from "./utils/statusStyles";
import { StatusUpdateButtons } from "./StatusUpdateButtons";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Invoice } from "./payment/Invoice";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PreviewLabScriptModal } from "@/components/surgical-form/PreviewLabScriptModal";

interface TableRowContentProps {
  script: any;
  onPreview: (script: any, e: React.MouseEvent) => void;
  onStatusUpdate?: (id: string, status: string) => void;
  isDesignPortal?: boolean;
  hideClinicColumn?: boolean;
}

export const TableRowContent = ({ 
  script, 
  onPreview, 
  onStatusUpdate,
  isDesignPortal = false,
  hideClinicColumn = false
}: TableRowContentProps) => {
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [showPrintInvoice, setShowPrintInvoice] = useState(false);

  const handleViewInvoice = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowInvoiceDialog(true);
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPrintPreview(true);
  };

  const handlePrintInvoice = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPrintInvoice(true);
  };

  const clinicName = script.patients?.clinics?.name;
  const doctorName = script.patients?.clinics?.doctor_name;

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
        {!hideClinicColumn && (
          <TableCell>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {clinicName || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  {doctorName ? `Dr. ${doctorName}` : 'N/A'}
                </p>
              </div>
            </div>
          </TableCell>
        )}
        <TableCell>
          <div className="space-y-1">
            <p className="font-medium text-gray-900">
              {script.appliance_type.split('-').map((word: string) => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
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
            <span className="capitalize">{script.status.replace('_', ' ')}</span>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-48 bg-white border border-gray-200 shadow-lg rounded-md"
              >
                <DropdownMenuItem 
                  onClick={handlePrint}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Print Script
                </DropdownMenuItem>
                {script.payment_status === 'paid' && (
                  <>
                    <DropdownMenuItem 
                      onClick={handleViewInvoice}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <Receipt className="mr-2 h-4 w-4" />
                      View Invoice
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handlePrintInvoice}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <Printer className="mr-2 h-4 w-4" />
                      Print Invoice
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem 
                  onClick={(e) => onPreview(script, e)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Script
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>

      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0">
          <DialogHeader className="px-2 py-3 border-b">
            <DialogTitle>Invoice Preview</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 h-full">
            <div className="p-6">
              <Invoice labScript={script} />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {showPrintPreview && (
        <PreviewLabScriptModal
          isOpen={showPrintPreview}
          onClose={() => setShowPrintPreview(false)}
          labScriptId={script.id}
          printMode={true}
        />
      )}

      {showPrintInvoice && (
        <Dialog open={showPrintInvoice} onOpenChange={setShowPrintInvoice}>
          <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0">
            <DialogHeader className="px-2 py-3 border-b">
              <DialogTitle>Invoice Preview</DialogTitle>
            </DialogHeader>
            <ScrollArea className="flex-1 h-full print:overflow-visible">
              <div className="p-6">
                <Invoice labScript={script} />
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};