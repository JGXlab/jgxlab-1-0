import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, FileText } from "lucide-react";
import { useState, useCallback } from "react";
import { Invoice } from "./Invoice";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  const [showInvoice, setShowInvoice] = useState(false);

  const { data: labScript } = useQuery({
    queryKey: ['labScript', paymentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lab_scripts')
        .select(`
          *,
          invoices (
            discount_amount,
            promo_code
          )
        `)
        .eq('payment_id', paymentId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!paymentId,
  });

  const handleClose = useCallback(() => {
    setShowInvoice(false);
    onClose();
  }, [onClose]);

  const handleInvoiceClose = useCallback(() => {
    setShowInvoice(false);
  }, []);

  if (showInvoice && labScript) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Invoice</DialogTitle>
          </DialogHeader>
          <Invoice labScript={labScript} onClose={handleInvoiceClose} />
          <div className="flex justify-end space-x-2 mt-4">
            {invoiceUrl && (
              <Button
                variant="outline"
                onClick={() => window.open(invoiceUrl, '_blank')}
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
          {labScript?.invoices?.[0]?.promo_code && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Applied Discount</p>
              <p className="text-sm font-medium text-green-600">
                Promo code {labScript.invoices[0].promo_code} applied
                {labScript.invoices[0].discount_amount && 
                  ` (-$${labScript.invoices[0].discount_amount.toFixed(2)})`
                }
              </p>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={() => setShowInvoice(true)}
            >
              <FileText className="mr-2 h-4 w-4" />
              View Invoice
            </Button>
            {invoiceUrl && (
              <Button
                variant="outline"
                onClick={() => window.open(invoiceUrl, '_blank')}
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};