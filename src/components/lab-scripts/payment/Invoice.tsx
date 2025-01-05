import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InvoiceHeader } from "./InvoiceHeader";
import { BillingAddresses } from "./BillingAddresses";
import { InvoiceTable } from "./InvoiceTable";
import { InvoicePDF } from "./InvoicePDF";
import { pdf } from '@react-pdf/renderer';
import { useState } from "react";

interface InvoiceProps {
  labScript: any;
}

export const Invoice = ({ labScript }: InvoiceProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const { data: invoice, isLoading: isLoadingInvoice } = useQuery({
    queryKey: ['invoice', labScript.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('lab_script_id', labScript.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!labScript.id,
  });

  const handleDownload = async () => {
    if (!invoice) return;
    
    setIsDownloading(true);
    try {
      const blob = await pdf(<InvoicePDF labScript={labScript} invoice={invoice} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${labScript.payment_id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
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
    <Card className="bg-white w-full max-w-[210mm] mx-auto shadow-none border-none">
      <div className="flex justify-end p-4 border-b">
        <Button
          variant="outline"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          <span className="ml-2">Download PDF</span>
        </Button>
      </div>
      <div className="p-8 space-y-8">
        <InvoiceHeader labScript={labScript} />
        <BillingAddresses invoice={invoice} />
        <InvoiceTable invoice={invoice} />
      </div>
    </Card>
  );
};