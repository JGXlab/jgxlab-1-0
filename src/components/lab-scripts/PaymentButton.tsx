import { Button } from "@/components/ui/button";

interface PaymentButtonProps {
  onClick: (e: React.MouseEvent) => void;
  isLoading?: boolean;
}

export const PaymentButton = ({ onClick, isLoading = false }: PaymentButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      onClick={onClick}
      disabled={isLoading}
    >
      <span>{isLoading ? "Processing..." : "Pay"}</span>
    </Button>
  );
};