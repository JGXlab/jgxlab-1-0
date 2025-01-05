import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { InvoiceHeader } from "./InvoiceHeader";
import { BillingAddresses } from "./BillingAddresses";
import { InvoiceTable } from "./InvoiceTable";

interface InvoiceProps {
  labScript: any;
  onDownload?: () => void;
}

export const Invoice = ({ labScript, onDownload }: InvoiceProps) => {
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
      <div className="p-8 space-y-8">
        <InvoiceHeader labScript={labScript} />
        <BillingAddresses invoice={invoice} />
        <InvoiceTable invoice={invoice} />
      </div>
    </Card>
  );
};