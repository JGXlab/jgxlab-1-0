import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Printer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { InvoiceHeader } from "./InvoiceHeader";
import { BillingAddresses } from "./BillingAddresses";
import { InvoiceTable } from "./InvoiceTable";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface InvoiceProps {
  labScript: any;
}

export const Invoice = ({ labScript }: InvoiceProps) => {
  const { toast } = useToast();
  const { data: invoice, isLoading: isLoadingInvoice } = useQuery({
    queryKey: ['invoice', labScript.id],
    queryFn: async () => {
      console.log('Fetching invoice for lab script:', labScript.id);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('lab_script_id', labScript.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching invoice:', error);
        throw error;
      }

      console.log('Fetched invoice:', data);
      return data;
    },
    enabled: !!labScript.id,
  });

  const handlePrint = () => {
    try {
      const printContent = document.querySelector('.invoice-content');
      if (!printContent) {
        throw new Error('Print content not found');
      }
      
      const originalDisplay = document.body.style.display;
      const printStyles = `
        @page { 
          size: A4;
          margin: 0;
        }
        @media print {
          body { 
            margin: 1.6cm;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          * {
            color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .invoice-content {
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            margin: 0;
            background: white;
            box-shadow: none;
            font-size: 12pt;
          }
          .bg-primary, .text-primary, .border-primary {
            color: #375bdc !important;
            background-color: #375bdc !important;
            border-color: #375bdc !important;
          }
          .bg-success, .text-success {
            color: #22c55e !important;
            background-color: #22c55e !important;
          }
          .bg-muted, .text-muted {
            color: #64748b !important;
            background-color: #64748b !important;
          }
          .text-card-foreground {
            color: #0f172a !important;
          }
          .bg-accent {
            background-color: #f8fafc !important;
          }
        }
      `;
      
      const styleSheet = document.createElement('style');
      styleSheet.textContent = printStyles;
      document.head.appendChild(styleSheet);
      
      document.body.style.display = 'none';
      const printWindow = window.open('', '', 'width=800,height=600');
      if (!printWindow) {
        throw new Error('Could not open print window');
      }
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice</title>
            ${document.head.innerHTML}
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      // Wait for resources to load
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        document.body.style.display = originalDisplay;
        document.head.removeChild(styleSheet);
      }, 250);

      toast({
        title: "Print Started",
        description: "The invoice print dialog should open shortly.",
      });
    } catch (error) {
      console.error('Print error:', error);
      toast({
        title: "Print Error",
        description: "Failed to print the invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoadingInvoice) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted">No invoice found</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        onClick={handlePrint}
        size="icon"
        variant="ghost"
        className="absolute top-0 right-0 m-4"
        title="Print Invoice"
      >
        <Printer className="h-4 w-4" />
      </Button>
      <Card className="w-[210mm] h-[297mm] mx-auto shadow-none border-none bg-white invoice-content">
        <div className="p-6 space-y-6 h-full">
          <InvoiceHeader labScript={labScript} />
          <BillingAddresses invoice={invoice} />
          <InvoiceTable invoice={invoice} />
        </div>
      </Card>
    </div>
  );
};