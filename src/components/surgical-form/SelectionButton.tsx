import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectionButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

export const SelectionButton = ({ label, isSelected, onClick, icon }: SelectionButtonProps) => {
  return (
    <Button
      type="button"
      variant={isSelected ? "default" : "outline"}
      className={cn(
        "flex items-center gap-3 px-4 py-2 h-auto border rounded-lg w-full sm:w-auto",
        isSelected ? "bg-primary/10 border-primary text-primary hover:bg-primary/20" : "hover:border-primary/50",
      )}
      onClick={onClick}
    >
      <div className={cn(
        "flex items-center justify-center w-5 h-5 rounded-full border",
        isSelected ? "bg-primary border-primary" : "border-gray-300"
      )}>
        {isSelected && <Check className="h-3 w-3 text-white" />}
      </div>
      <span className="font-medium">{label}</span>
      {icon}
    </Button>
  );
};