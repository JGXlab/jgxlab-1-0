import { Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "./InvoicePDF";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";
import { ReactElement } from "react";

interface InvoiceActionsProps {
  labScript: Tables<"lab_scripts">;
  invoice: Tables<"invoices">;
}

export const InvoiceActions = ({ labScript, invoice }: InvoiceActionsProps) => {
  const { toast } = useToast();

  const handlePrint = () => {
    console.log('Printing invoice...');
    const printContent = document.getElementById('invoice-content');
    if (printContent) {
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent.innerHTML;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    } else {
      toast({
        title: "Print Error",
        description: "Could not find invoice content to print",
        variant: "destructive",
      });
    }
  };

  const renderDownloadButton = ({ loading }: { loading: boolean }): ReactElement => (
    <Button variant="outline" disabled={loading}>
      <Download className="mr-2 h-4 w-4" />
      {loading ? "Generating PDF..." : "Download PDF"}
    </Button>
  );

  return (
    <div className="flex justify-end gap-2">
      <PDFDownloadLink
        document={<InvoicePDF labScript={labScript} invoice={invoice} />}
        fileName={`invoice-${invoice.id}.pdf`}
      >
        {renderDownloadButton}
      </PDFDownloadLink>
      <Button variant="outline" onClick={handlePrint}>
        <Printer className="mr-2 h-4 w-4" />
        Print Invoice
      </Button>
    </div>
  );
};