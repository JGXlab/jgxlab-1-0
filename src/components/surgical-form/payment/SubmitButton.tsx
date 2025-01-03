import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isSubmitting: boolean;
  isPending: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export const SubmitButton = ({ isSubmitting, isPending, onClick }: SubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      size="lg"
      disabled={isSubmitting || isPending}
      className="min-w-[200px]"
      onClick={onClick}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Redirecting to payment...
        </>
      ) : (
        'Pay and Submit Lab Script'
      )}
    </Button>
  );
};