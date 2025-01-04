import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface PaymentDetails {
  paymentId: string;
  invoiceUrl: string;
}

export const usePaymentVerification = () => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const verifyPayment = async (sessionId: string, labScriptId?: string) => {
    try {
      console.log('Verifying payment for session:', sessionId);
      
      const { data, error } = await supabase.functions.invoke('get-session-payment', {
        body: { sessionId, labScriptId }
      });

      if (error) {
        console.error('Payment verification error:', error);
        throw error;
      }

      if (data?.status === 'complete') {
        console.log('Payment verified successfully:', data);
        setPaymentDetails({
          paymentId: data.paymentId,
          invoiceUrl: data.invoiceUrl
        });
        setShowSuccessDialog(true);
        
        // Invalidate and refetch the lab scripts query to show the new entry
        await queryClient.invalidateQueries({ queryKey: ['labScripts'] });
        
        toast({
          title: "Success",
          description: "Lab script has been created successfully",
        });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast({
        title: "Error",
        description: "Failed to verify payment status",
        variant: "destructive",
      });
    }
  };

  const closeSuccessDialog = () => {
    setShowSuccessDialog(false);
    setPaymentDetails(null);
  };

  return {
    verifyPayment,
    showSuccessDialog,
    paymentDetails,
    closeSuccessDialog
  };
};