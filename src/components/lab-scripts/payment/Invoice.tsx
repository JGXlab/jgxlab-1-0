import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { InvoiceHeader } from "./InvoiceHeader";
import { BillingAddresses } from "./BillingAddresses";
import { InvoiceTable } from "./InvoiceTable";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "./InvoicePDF";

interface InvoiceProps {
  labScript: any;
  onClose?: () => void;
}

export const Invoice = ({ labScript, onClose }: InvoiceProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

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
    <div className="relative max-h-[calc(100vh-8rem)] overflow-hidden">
      <div className="absolute top-4 right-4 z-10">
        <PDFDownloadLink
          document={<InvoicePDF labScript={labScript} invoice={invoice} />}
          fileName={`invoice-${labScript.id}.pdf`}
        >
          {({ loading }) => (
            <Button
              size="icon"
              variant="outline"
              title="Download Invoice"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
          )}
        </PDFDownloadLink>
      </div>
      <ScrollArea className="h-[calc(100vh-12rem)] px-4 pt-16">
        <Card 
          ref={contentRef}
          className="w-full mx-auto shadow-none border-none bg-white invoice-content"
        >
          <div className="p-6 space-y-6">
            <InvoiceHeader labScript={labScript} />
            <BillingAddresses invoice={invoice} />
            <InvoiceTable invoice={invoice} />
          </div>
        </Card>
      </ScrollArea>
    </div>
  );
};