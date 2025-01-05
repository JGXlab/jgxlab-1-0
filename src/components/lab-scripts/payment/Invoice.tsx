import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, Printer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { InvoiceHeader } from "./InvoiceHeader";
import { BillingAddresses } from "./BillingAddresses";
import { InvoiceTable } from "./InvoiceTable";
import { Button } from "@/components/ui/button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "./InvoicePDF";
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
    console.log('Printing invoice...');
    const printContent = document.getElementById('invoice-content');
    if (printContent) {
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload(); // Reload to restore React functionality
    } else {
      toast({
        title: "Print Error",
        description: "Could not find invoice content to print",
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
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <PDFDownloadLink
          document={<InvoicePDF labScript={labScript} invoice={invoice} />}
          fileName={`invoice-${invoice.id}.pdf`}
        >
          {({ loading }) => (
            <Button variant="outline" disabled={loading}>
              <Download className="mr-2 h-4 w-4" />
              {loading ? "Generating PDF..." : "Download PDF"}
            </Button>
          )}
        </PDFDownloadLink>
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" />
          Print Invoice
        </Button>
      </div>
      
      <Card id="invoice-content" className="w-[210mm] h-[297mm] mx-auto shadow-none border-none bg-white">
        <div className="p-6 space-y-6 h-full">
          <InvoiceHeader labScript={labScript} />
          <BillingAddresses invoice={invoice} />
          <InvoiceTable invoice={invoice} />
        </div>
      </Card>
    </div>
  );
};