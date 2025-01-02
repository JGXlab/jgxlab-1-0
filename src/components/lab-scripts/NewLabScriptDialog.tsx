import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NewLabScriptForm } from "./NewLabScriptForm";

interface NewLabScriptDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewLabScriptDialog = ({ isOpen, onClose }: NewLabScriptDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Lab Script</DialogTitle>
        </DialogHeader>
        <NewLabScriptForm onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
};