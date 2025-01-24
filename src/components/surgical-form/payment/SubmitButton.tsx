import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  isPending: boolean;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  totalAmount?: number;
}

export const SubmitButton = ({ 
  isSubmitting, 
  isPending, 
  onClick,
  disabled = false,
  totalAmount = 0
}: SubmitButtonProps) => {
  const buttonText = totalAmount === 0 ? "Submit" : "Submit & Pay";

  return (
    <Button
      type="submit"
      size="lg"
      className="min-w-[150px]"
      onClick={onClick}
      disabled={isSubmitting || isPending || disabled}
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