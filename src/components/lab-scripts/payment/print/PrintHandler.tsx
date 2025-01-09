import { useToast } from "@/components/ui/use-toast";

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

      // Create print window with exact content
      const printWindow = window.open('', '', 'width=800,height=600');
      if (!printWindow) {
        throw new Error('Could not open print window');
      }
      
      // Copy all styles from the current document
      const styles = Array.from(document.styleSheets)
        .map(styleSheet => {
          try {
            return Array.from(styleSheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          } catch (e) {
            console.log('Error accessing styleSheet:', e);
            return '';
          }
        })
        .join('\n');

      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice</title>
            <style>${styles}</style>
          </head>
          <body>
            <div class="invoice-content">
              ${contentRef.current.innerHTML}
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      // Print after a short delay to ensure styles are applied
      setTimeout(() => {
        printWindow.print();
        // Close window after printing
        setTimeout(() => {
          printWindow.close();
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