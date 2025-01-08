import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Printer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { InvoiceHeader } from "./InvoiceHeader";
import { BillingAddresses } from "./BillingAddresses";
import { InvoiceTable } from "./InvoiceTable";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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

      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Could not open print window');
      }

      // Add print-specific styles
      const printStyles = `
        @page {
          size: A4;
          margin: 20mm;
        }
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          .invoice-content {
            width: 100%;
            max-width: none;
            margin: 0;
            padding: 0;
            box-shadow: none;
            border: none;
          }
          .no-print {
            display: none !important;
          }
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        .invoice-content {
          background: white;
          padding: 40px;
          min-height: 297mm;
          width: 210mm;
          margin: 0 auto;
        }
      `;

      // Write the content to the new window
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Invoice ${invoice?.payment_id || ''}</title>
            <style>${printStyles}</style>
          </head>
          <body>
            <div class="invoice-content">
              ${printContent.innerHTML}
            </div>
            <script>
              window.onload = () => {
                setTimeout(() => {
                  window.print();
                  window.close();
                }, 250);
              };
            </script>
          </body>
        </html>
      `);

      printWindow.document.close();

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
        className="absolute top-0 right-0 m-4 no-print"
        title="Print Invoice"
      >
        <Printer className="h-4 w-4" />
      </Button>
      <Card className="w-[210mm] mx-auto shadow-none border-none bg-white invoice-content">
        <div className="p-6 space-y-6">
          <InvoiceHeader labScript={labScript} />
          <BillingAddresses invoice={invoice} />
          <InvoiceTable invoice={invoice} />
        </div>
      </Card>
    </div>
  );
};