import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  isPending: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export const SubmitButton = ({ isSubmitting, isPending, onClick }: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isSubmitting || isPending}
      onClick={onClick}
      className="w-full md:w-auto"
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Redirecting to payment...
        </>
      ) : (
        "Submit and Pay"
      )}
    </Button>
  );
};