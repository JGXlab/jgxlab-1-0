import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Invoice } from "../lab-scripts/payment/Invoice";
import { useToast } from "@/components/ui/use-toast";

interface PreviewLabScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  labScriptId: string;
}

export const PreviewLabScriptModal = ({
  isOpen,
  onClose,
  labScriptId,
}: PreviewLabScriptModalProps) => {
  const { toast } = useToast();
  const { data: labScript } = useQuery({
    queryKey: ['lab-script', labScriptId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lab_scripts')
        .select(`
          *,
          patients (
            first_name,
            last_name
          )
        `)
        .eq('id', labScriptId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handlePrint = () => {
    try {
      const printContent = document.querySelector('.invoice-content');
      if (!printContent) {
        throw new Error('Print content not found');
      }
      
      const originalDisplay = document.body.style.display;
      const printStyles = `
        @page { size: A4; margin: 0; }
        body { margin: 1.6cm; }
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[230mm] h-[90vh]" showPrintButton onPrint={handlePrint}>
        {labScript && <Invoice labScript={labScript} />}
      </DialogContent>
    </Dialog>
  );
};