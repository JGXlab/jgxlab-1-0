import { PreviewField } from "./PreviewField";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";

interface PaymentSectionProps {
  labScript: Tables<"lab_scripts">;
}

export const PaymentSection = ({ labScript }: PaymentSectionProps) => {
  const { data: paymentInfo, isLoading } = useQuery({
    queryKey: ['payment', labScript.id],
    queryFn: async () => {
      console.log('Fetching payment info for lab script:', labScript.id);
      const response = await fetch(`/api/get-payment-info?labScriptId=${labScript.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch payment information');
      }
      return response.json();
    },
    enabled: labScript.payment_status === 'paid' && !labScript.is_free_printed_tryin
  });

  // If it's a free printed try-in with a coupon code, only show that
  if (labScript.is_free_printed_tryin && labScript.coupon_code) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Free Printed Try-in</h3>
        <PreviewField 
          label="Claimed Coupon Code" 
          value={labScript.coupon_code}
          className="font-semibold text-primary"
        />
      </div>
    );
  }

  if (labScript.payment_status !== 'paid') {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
        <PreviewField 
          label="Payment Status" 
          value={<span className="text-yellow-600">Pending Payment</span>} 
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PreviewField 
          label="Payment Status" 
          value={<span className="text-green-600">Paid</span>} 
        />
        <div className="sm:col-span-2">
          <PreviewField 
            label="Payment ID" 
            value={
              <div className="break-all">
                {labScript.payment_id || 'N/A'}
              </div>
            } 
          />
        </div>
        <PreviewField 
          label="Payment Date" 
          value={labScript.payment_date 
            ? format(new Date(labScript.payment_date), 'MMM d, yyyy h:mm a')
            : 'N/A'
          } 
        />
      </div>
      {paymentInfo?.invoice_url && (
        <div className="pt-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.open(paymentInfo.invoice_url, '_blank')}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </Button>
        </div>
      )}
    </div>
  );
};