import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  isPending: boolean;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  isFreeTrialEligible?: boolean;
}

export const SubmitButton = ({ 
  isSubmitting, 
  isPending, 
  onClick, 
  disabled,
  isFreeTrialEligible = false
}: SubmitButtonProps) => {
  const isLoading = isSubmitting || isPending;
  
  return (
    <Button
      type="submit"
      className="min-w-[150px] bg-primary hover:bg-primary/90"
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isFreeTrialEligible ? 'Creating...' : 'Processing...'}
        </>
      ) : (
        isFreeTrialEligible ? 'Create Lab Script' : 'Proceed to Payment'
      )}
    </Button>
  );
};