import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Invoice } from "./Invoice";

interface InvoicePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  labScript: any;
}

export const InvoicePreviewDialog = ({ isOpen, onClose, labScript }: InvoicePreviewDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0">
        <DialogHeader className="px-2 py-3 border-b">
          <DialogTitle>Invoice Preview</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 h-full">
          <div className="p-6">
            <Invoice labScript={labScript} onClose={onClose} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};