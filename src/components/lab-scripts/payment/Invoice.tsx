import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Printer } from "lucide-react";
import { Card } from "@/components/ui/card";
import { InvoiceHeader } from "./InvoiceHeader";
import { BillingAddresses } from "./BillingAddresses";
import { InvoiceTable } from "./InvoiceTable";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { usePrintHandler } from "./print/PrintHandler";

interface InvoiceProps {
  labScript: any;
  onClose?: () => void;
}

export const Invoice = ({ labScript, onClose }: InvoiceProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { handlePrint } = usePrintHandler();

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

  // Cleanup function to remove any leftover print styles
  useEffect(() => {
    return () => {
      const printStyleSheet = document.getElementById('invoice-print-styles');
      if (printStyleSheet) {
        printStyleSheet.remove();
      }
    };
  }, []);

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
      <div className="flex justify-end gap-2 mb-4">
        <Button
          onClick={() => handlePrint(contentRef)}
          size="icon"
          variant="outline"
          className="m-4"
          title="Print Invoice"
        >
          <Printer className="h-4 w-4" />
        </Button>
        {onClose && (
          <Button
            onClick={onClose}
            size="sm"
            variant="outline"
            className="m-4"
          >
            Close
          </Button>
        )}
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-12rem)] px-4">
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
      </div>
    </div>
  );
};