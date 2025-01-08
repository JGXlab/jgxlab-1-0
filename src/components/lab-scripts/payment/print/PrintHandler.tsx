import { useToast } from "@/components/ui/use-toast";
import { getPrintStyles } from "./PrintStyles";

interface PrintHandlerProps {
  contentRef: React.RefObject<HTMLDivElement>;
}

export const usePrintHandler = () => {
  const { toast } = useToast();

  const handlePrint = (contentRef: React.RefObject<HTMLDivElement>) => {
    try {
      if (!contentRef.current) {
        throw new Error('Print content not found');
      }
      
      // Remove any existing print styles
      const existingStyles = document.getElementById('invoice-print-styles');
      if (existingStyles) {
        existingStyles.remove();
      }

      const styleSheet = document.createElement('style');
      styleSheet.id = 'invoice-print-styles';
      styleSheet.textContent = getPrintStyles();
      document.head.appendChild(styleSheet);
      
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
            ${contentRef.current.innerHTML}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
        setTimeout(() => {
          printWindow.close();
          const printStyleSheet = document.getElementById('invoice-print-styles');
          if (printStyleSheet) {
            printStyleSheet.remove();
          }
        }, 100);
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

  return { handlePrint };
};