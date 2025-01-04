import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const usePaymentVerification = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<{
    paymentId: string;
    invoiceUrl?: string;
  } | null>(null);
  const verificationInProgress = useRef(false);
  const verifiedSessions = useRef(new Set<string>());

  const verifyPayment = async (sessionId: string) => {
    // Check if this session has already been verified
    if (verifiedSessions.current.has(sessionId)) {
      console.log('Session already verified, skipping...', sessionId);
      return;
    }

    // Prevent multiple verifications running simultaneously
    if (verificationInProgress.current) {
      console.log('Payment verification already in progress, skipping...');
      return;
    }

    console.log('Starting payment verification for session:', sessionId);
    verificationInProgress.current = true;
    
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
        console.log('Payment confirmed as paid');
        
        // Add session to verified set
        verifiedSessions.current.add(sessionId);
        
        // Set payment details and show success dialog
        setPaymentDetails({
          paymentId: data.paymentId,
          invoiceUrl: data.invoiceUrl
        });
        setShowSuccessDialog(true);

        // Invalidate and refetch lab scripts query
        await queryClient.invalidateQueries({ queryKey: ['labScripts'] });

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
    } finally {
      verificationInProgress.current = false;
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