import { PreviewField } from "./preview/PreviewField";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./formSchema";

interface PaymentSectionProps {
  labScript?: Tables<"lab_scripts">;
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isSubmitting: boolean;
  applianceType: string;
  archType: string;
  needsNightguard: string;
  expressDesign: string;
  onSuccess?: () => void;
}

export const PaymentSection = ({ 
  labScript, 
  form,
  onSubmit,
  isSubmitting,
  applianceType,
  archType,
  needsNightguard,
  expressDesign,
  onSuccess
}: PaymentSectionProps) => {
  const { data: paymentInfo, isLoading } = useQuery({
    queryKey: ['payment', labScript?.id],
    queryFn: async () => {
      console.log('Fetching payment info for lab script:', labScript?.id);
      const response = await fetch(`/api/get-payment-info?labScriptId=${labScript?.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch payment information');
      }
      return response.json();
    },
    enabled: labScript?.payment_status === 'paid' && !labScript?.is_free_printed_tryin
  });

  const handlePayment = async () => {
    try {
      const formValues = form.getValues();
      console.log('Form values for payment:', formValues);

      // First, save the draft
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: draft, error: draftError } = await supabase
        .from('lab_scripts_draft')
        .insert({
          patient_id: formValues.patientId,
          appliance_type: formValues.applianceType,
          arch: formValues.arch,
          treatment_type: formValues.treatmentType,
          screw_type: formValues.screwType,
          other_screw_type: formValues.otherScrewType,
          vdo_details: formValues.vdoDetails,
          needs_nightguard: formValues.needsNightguard,
          shade: formValues.shade,
          due_date: formValues.dueDate,
          specific_instructions: formValues.specificInstructions,
          express_design: formValues.expressDesign,
          user_id: user.id
        })
        .select()
        .single();

      if (draftError) {
        console.error('Error saving draft:', draftError);
        toast.error('Error saving lab script draft');
        return;
      }

      console.log('Created draft lab script:', draft);

      // Calculate line items based on selections
      const lineItems = [];
      
      // Add base price for appliance type
      if (applianceType === 'surgical') {
        lineItems.push({ price: 'price_surgical', quantity: 1 });
      } else if (applianceType === 'surgical-day') {
        lineItems.push({ price: 'price_surgical_day', quantity: 1 });
      }

      // Add nightguard if selected
      if (needsNightguard === 'yes') {
        lineItems.push({ price: 'price_nightguard', quantity: 1 });
      }

      // Add express design if selected
      if (expressDesign === 'yes') {
        lineItems.push({ price: 'price_express', quantity: 1 });
      }

      // Create checkout session with draft ID in metadata
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lineItems,
          formData: {
            draftId: draft.id
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      console.log('Redirecting to checkout URL:', url);
      window.location.href = url;
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Error processing payment');
    }
  };

  // If it's a free printed try-in with a coupon code, only show that
  if (labScript?.is_free_printed_tryin && labScript?.coupon_code) {
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

  if (labScript && labScript.payment_status !== 'paid') {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
        <PreviewField 
          label="Payment Status" 
          value={<span className="text-yellow-600">Pending Payment</span>} 
        />
        <Button 
          onClick={handlePayment}
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Proceed to Payment'
          )}
        </Button>
      </div>
    );
  }

  if (!labScript) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
        <Button 
          onClick={handlePayment}
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Proceed to Payment'
          )}
        </Button>
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
      <div className="grid grid-cols-2 gap-4">
        <PreviewField 
          label="Payment Status" 
          value={<span className="text-green-600">Paid</span>} 
        />
        <PreviewField 
          label="Amount Paid" 
          value={labScript.amount_paid ? `$${labScript.amount_paid.toFixed(2)}` : 'N/A'} 
        />
        <PreviewField 
          label="Payment ID" 
          value={labScript.payment_id || 'N/A'} 
        />
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