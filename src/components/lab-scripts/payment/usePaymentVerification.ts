import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const usePaymentVerification = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    paymentId: string;
    invoiceUrl?: string;
  } | null>(null);

  const verifyPayment = async (sessionId: string) => {
    console.log('Verifying payment for session:', sessionId);
    
    try {
      const { data, error } = await supabase.functions.invoke('get-session-payment', {
        body: { sessionId }
      });

      console.log('Payment verification response:', data);

      if (error) {
        console.error('Error from edge function:', error);
        throw new Error('Failed to verify payment');
      }

      if (data.status === 'paid') {
        // Set payment details and show success dialog
        setPaymentDetails({
          paymentId: data.paymentId,
          invoiceUrl: data.invoiceUrl
        });
        setShowSuccessDialog(true);

        toast({
          title: "Payment Successful",
          description: "Your lab script has been submitted successfully.",
        });

        return;
      }

      throw new Error('Payment not confirmed');
    } catch (error) {
      console.error('Payment verification error:', error);
      toast({
        title: "Payment Verification Error",
        description: "There was an issue verifying your payment. Please contact support.",
        variant: "destructive",
      });
      navigate('/clinic/submittedlabscripts', { replace: true });
    }
  };

  const closeSuccessDialog = () => {
    setShowSuccessDialog(false);
    navigate('/clinic/submittedlabscripts', { replace: true });
  };

  return { 
    verifyPayment,
    showSuccessDialog,
    paymentDetails,
    closeSuccessDialog
  };
};