import { Button } from "@/components/ui/button";
import { MoreVertical, Eye, Receipt, Printer } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Invoice } from "../payment/Invoice";

interface LabScriptActionsProps {
  script: any;
  onPreview: (script: any, e: React.MouseEvent) => void;
}

export const LabScriptActions = ({ script, onPreview }: LabScriptActionsProps) => {
  const handleViewInvoice = (e: React.MouseEvent) => {
    e.preventDefault();
    // Create a new div for printing
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) {
      console.error('Could not open print window');
      return;
    }

    // Write the invoice content to the new window
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          ${document.head.innerHTML}
        </head>
        <body>
          <div style="padding: 20px;">
            <div id="invoice-content"></div>
          </div>
        </body>
      </html>
    `);

    // Render the Invoice component into the new window
    const invoiceContent = printWindow.document.getElementById('invoice-content');
    if (invoiceContent) {
      // Create a temporary div in the current document
      const tempDiv = document.createElement('div');
      const invoice = <Invoice labScript={script} />;
      
      // Render the invoice content
      invoiceContent.innerHTML = tempDiv.innerHTML;
      
      // Wait for resources to load then print
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    // Implementation for printing lab script
    console.log('Printing lab script...');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-300 hover:scale-105"
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">More options</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-white border border-gray-200 shadow-lg rounded-md"
      >
        <DropdownMenuItem 
          onClick={handlePrint}
          className="cursor-pointer hover:bg-gray-100"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print Script
        </DropdownMenuItem>
        {script.payment_status === 'paid' && (
          <>
            <DropdownMenuItem 
              onClick={handleViewInvoice}
              className="cursor-pointer hover:bg-gray-100"
            >
              <Receipt className="mr-2 h-4 w-4" />
              Print Invoice
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem 
          onClick={(e) => onPreview(script, e)}
          className="cursor-pointer hover:bg-gray-100"
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview Script
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};