import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  isPending: boolean;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  totalAmount?: number;
  isValid?: boolean;
}

export const SubmitButton = ({ 
  isSubmitting, 
  isPending, 
  onClick,
  disabled = false,
  totalAmount = 0,
  isValid = false
}: SubmitButtonProps) => {
  const buttonText = totalAmount === 0 ? "Submit" : "Submit & Pay";

  return (
    <Button
      type="submit"
      size="lg"
      className="min-w-[150px]"
      onClick={onClick}
      disabled={isSubmitting || isPending || disabled || !isValid}
    >
      {isSubmitting || isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        buttonText
      )}
    </Button>
  );
};