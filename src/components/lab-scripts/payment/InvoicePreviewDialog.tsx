import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Invoice } from "./Invoice";
import { useCallback, useEffect } from "react";

interface InvoicePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  labScript: any;
}

export const InvoicePreviewDialog = ({ isOpen, onClose, labScript }: InvoicePreviewDialogProps) => {
  // Cleanup function to ensure proper state reset
  useEffect(() => {
    return () => {
      document.body.style.pointerEvents = 'auto';
    };
  }, []);

  const handleClose = useCallback(() => {
    document.body.style.pointerEvents = 'auto';
    onClose();
  }, [onClose]);

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={handleClose}
    >
      <DialogContent 
        className="max-w-4xl h-[90vh] p-0 gap-0"
        onPointerDownOutside={(e) => {
          e.preventDefault();
          handleClose();
        }}
        onEscapeKeyDown={handleClose}
      >
        <DialogHeader className="px-2 py-3 border-b">
          <DialogTitle>Invoice Preview</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 h-full">
          <div className="p-6">
            <Invoice labScript={labScript} onClose={handleClose} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};