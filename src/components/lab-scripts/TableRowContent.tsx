import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Eye, CreditCard, Calendar, FileText, Download } from "lucide-react";
import { format } from "date-fns";
import { getStatusColor, getPaymentStatusColor, getApplianceTypeDisplay } from "./utils/statusStyles";
import * as LucideIcons from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { Invoice } from "./payment/Invoice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TableRowContentProps {
  script: any;
  onPreview: (script: any, e: React.MouseEvent) => void;
}

export const TableRowContent = ({ script, onPreview }: TableRowContentProps) => {
  const [showInvoice, setShowInvoice] = useState(false);
  const StatusIcon = LucideIcons[script.status === 'pending' ? 'Clock' : 
    script.status === 'completed' ? 'CheckCircle2' : 'Info'];

  // Query to check if an invoice exists for this lab script
  const { data: invoice } = useQuery({
    queryKey: ['invoice', script.id],
    queryFn: async () => {
      if (script.payment_status !== 'paid') return null;
      
      console.log('Fetching invoice for lab script:', script.id);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('lab_script_id', script.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching invoice:', error);
        return null;
      }

      console.log('Found invoice:', data);
      return data;
    },
    enabled: script.payment_status === 'paid'
  });

  const handleDownloadInvoice = async () => {
    const invoiceElement = document.getElementById('invoice-content');
    if (!invoiceElement) return;

    const canvas = await html2canvas(invoiceElement, {
      backgroundColor: '#ffffff',
      scale: 2,
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`invoice-${script.payment_id}.pdf`);
  };

  return (
    <>
      <TableRow 
        key={script.id} 
        className="cursor-pointer hover:bg-gray-50/50 transition-colors duration-200"
      >
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
              {getApplianceTypeDisplay(script.appliance_type)}
            </p>
            <p className="text-sm text-gray-600">
              {script.arch.charAt(0).toUpperCase() + script.arch.slice(1)} Arch
            </p>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center space-x-2 text-gray-700">
            <Calendar className="h-4 w-4" />
            <span>{script.due_date}</span>
          </div>
        </TableCell>
        <TableCell>
          <Badge 
            variant="secondary"
            className={`flex items-center gap-1 w-fit bg-accent text-accent-foreground ${getStatusColor(script.status)}`}
          >
            <StatusIcon className="h-4 w-4" />
            <span className="capitalize">{script.status}</span>
          </Badge>
        </TableCell>
        <TableCell>
          <Badge 
            variant="secondary"
            className={`flex items-center gap-1 w-fit bg-accent text-accent-foreground ${getPaymentStatusColor(script.payment_status)}`}
          >
            <CreditCard className="h-4 w-4" />
            <span className="capitalize">{script.payment_status}</span>
          </Badge>
        </TableCell>
        <TableCell>
          <div className="text-sm text-gray-600">
            {format(new Date(script.created_at), 'MMM d, yyyy')}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-primary hover:text-primary hover:bg-primary/10 border-primary/20"
              onClick={(e) => onPreview(script, e)}
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </Button>
            {invoice && (
              <Button
                variant="outline"
                size="sm"
                className="text-primary hover:text-primary hover:bg-primary/10 border-primary/20"
                onClick={() => setShowInvoice(true)}
              >
                <FileText className="h-4 w-4" />
                <span>Invoice</span>
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>

      <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
        <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Invoice</DialogTitle>
          </DialogHeader>
          <div id="invoice-content" className="bg-white">
            <Invoice labScript={script} />
          </div>
          <DialogFooter className="mt-4">
            <Button
              onClick={handleDownloadInvoice}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};