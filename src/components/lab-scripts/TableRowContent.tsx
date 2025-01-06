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
import { toast } from "sonner";

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
    try {
      // Create a new window for printing
      const printWindow = window.open('', '', 'width=800,height=600');
      if (!printWindow) {
        throw new Error('Could not open print window');
      }

      const clinicInfo = script.patients?.clinics || {};
      const patientName = `${script.patients?.first_name || ''} ${script.patients?.last_name || ''}`;
      
      // Create a simple HTML template for the invoice
      const invoiceHTML = `
        <html>
          <head>
            <title>Invoice</title>
            <style>
              @page { size: A4; margin: 1.6cm; }
              body { font-family: system-ui, -apple-system, sans-serif; }
              .invoice-header { display: flex; justify-content: space-between; margin-bottom: 2rem; }
              .company-info { text-align: right; }
              .invoice-title { font-size: 2rem; color: #375bdc; margin-bottom: 1rem; }
              .details { margin: 2rem 0; }
              .table { width: 100%; border-collapse: collapse; margin: 2rem 0; }
              .table th, .table td { padding: 0.5rem; text-align: left; border-bottom: 1px solid #eee; }
              .total { text-align: right; margin-top: 2rem; }
            </style>
          </head>
          <body>
            <div style="padding: 20px;">
              <div class="invoice-header">
                <div>
                  <div class="invoice-title">Invoice</div>
                  <div>Payment ID: ${script.payment_id || 'N/A'}</div>
                  <div>Date: ${format(new Date(script.payment_date || new Date()), 'MMMM d, yyyy')}</div>
                </div>
                <div class="company-info">
                  <div style="font-weight: bold; color: #375bdc;">JGX Dental Lab LLC</div>
                  <div>25 Highview Trail</div>
                  <div>Pittsford, New York 14534</div>
                  <div>United States</div>
                  <div>+1 718-812-2869</div>
                </div>
              </div>

              <div class="details">
                <h3>Bill To:</h3>
                <div>${clinicInfo.name || 'N/A'}</div>
                <div>${clinicInfo.address || 'N/A'}</div>
                <div>Phone: ${clinicInfo.phone || 'N/A'}</div>
                <div>Email: ${clinicInfo.email || 'N/A'}</div>
              </div>

              <table class="table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${script.appliance_type.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')} - Patient: ${patientName}</td>
                    <td>1</td>
                    <td>$${script.amount_paid?.toFixed(2) || '0.00'}</td>
                  </tr>
                  ${script.needs_nightguard === 'yes' ? `
                    <tr>
                      <td>Additional Nightguard</td>
                      <td>1</td>
                      <td>$50.00</td>
                    </tr>
                  ` : ''}
                  ${script.express_design === 'yes' ? `
                    <tr>
                      <td>Express Design Service</td>
                      <td>1</td>
                      <td>$50.00</td>
                    </tr>
                  ` : ''}
                </tbody>
              </table>

              <div class="total">
                <div><strong>Total Amount:</strong> $${script.amount_paid?.toFixed(2) || '0.00'}</div>
                <div style="color: #059669;"><strong>Amount Paid:</strong> $${script.amount_paid?.toFixed(2) || '0.00'} USD</div>
              </div>
            </div>
          </body>
        </html>
      `;

      printWindow.document.write(invoiceHTML);
      printWindow.document.close();
      printWindow.focus();

      // Wait for resources to load then print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);

      toast.success("Print dialog opened");
    } catch (error) {
      console.error('Print error:', error);
      toast.error("Failed to open print dialog");
    }
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
    </>
  );
};