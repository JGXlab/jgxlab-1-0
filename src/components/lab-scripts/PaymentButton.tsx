import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

interface PaymentButtonProps {
  amount: number;
  onClick: (e: React.MouseEvent) => void;
  isLoading?: boolean;
}

export const PaymentButton = ({ amount, onClick, isLoading = false }: PaymentButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      onClick={onClick}
      disabled={isLoading}
    >
      <DollarSign className="h-4 w-4" />
      <span>{isLoading ? "Processing..." : `Pay $${amount.toFixed(2)} and Submit`}</span>
    </Button>
  );
};