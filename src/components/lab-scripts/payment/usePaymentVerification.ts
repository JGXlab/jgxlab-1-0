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
      console.log('Starting payment verification for session:', sessionId);
      
      const { data, error } = await supabase.functions.invoke('get-session-payment', {
        body: { sessionId }
      });

      if (error) {
        console.error('Payment verification error:', error);
        throw error;
      }

      console.log('Payment verification response:', data);

      if (data?.status === 'paid') {
        console.log('Payment verified successfully:', data);
        setPaymentDetails({
          paymentId: data.paymentId,
          invoiceUrl: data.invoiceUrl
        });
        setShowSuccessDialog(true);
        
        // Invalidate and refetch lab scripts
        console.log('Invalidating lab scripts query...');
        await queryClient.invalidateQueries({ queryKey: ['labScripts'] });
        await queryClient.refetchQueries({ queryKey: ['labScripts'] });
        console.log('Lab scripts query invalidated and refetched');
        
        toast({
          title: "Success",
          description: "Lab script has been created successfully",
        });
      } else {
        console.log('Payment not complete. Status:', data?.status);
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