import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Eye, Receipt } from "lucide-react";
import { format } from "date-fns";
import { getStatusColor, getPaymentStatusColor } from "./utils/statusStyles";
import { StatusUpdateButtons } from "./StatusUpdateButtons";

interface TableRowContentProps {
  script: any;
  onPreview: (script: any, e: React.MouseEvent) => void;
  onStatusUpdate?: (id: string, status: string) => void;
}

export const TableRowContent = ({ script, onPreview, onStatusUpdate }: TableRowContentProps) => {
  const handleViewInvoice = (e: React.MouseEvent) => {
    e.preventDefault();
    // Get the invoice URL from the payment details
    const invoiceUrl = script.invoice_url;
    if (invoiceUrl) {
      window.open(invoiceUrl, '_blank');
    }
  };

  return (
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
              variant="outline"
              size="sm"
              onClick={handleViewInvoice}
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
            >
              <Receipt className="h-4 w-4" />
              <span>Invoice</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => onPreview(script, e)}
            className="text-primary hover:text-primary hover:bg-primary/10 border-primary/20"
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};