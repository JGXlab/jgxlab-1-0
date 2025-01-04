import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download } from "lucide-react";

interface PaymentSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  paymentId: string;
  invoiceUrl?: string;
}

export const PaymentSuccessDialog = ({
  isOpen,
  onClose,
  paymentId,
  invoiceUrl,
}: PaymentSuccessDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <DialogTitle className="text-center text-xl">Payment Successful!</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Payment ID</p>
            <p className="text-sm font-mono bg-gray-50 p-2 rounded border">
              {paymentId}
            </p>
          </div>
          {invoiceUrl && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.open(invoiceUrl, '_blank')}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Invoice
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};