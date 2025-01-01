import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface VDODetailsSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const vdoDetailsOptions = [
  { id: "detail1", label: "Detail 1" },
  { id: "detail2", label: "Detail 2" },
  { id: "detail3", label: "Detail 3" },
];

export const VDODetailsSelector = ({ value, onChange }: VDODetailsSelectorProps) => {
  const toggleOption = (optionId: string) => {
    if (value.includes(optionId)) {
      onChange(value.filter((id) => id !== optionId));
    } else {
      onChange([...value, optionId]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {vdoDetailsOptions.map((option) => {
          const isSelected = value.includes(option.id);
          return (
            <Button
              key={option.id}
              type="button"
              variant={isSelected ? "default" : "outline"}
              className={cn(
                "flex items-center gap-2",
                isSelected && "bg-primary text-primary-foreground"
              )}
              onClick={() => toggleOption(option.id)}
            >
              {isSelected && <Check className="h-4 w-4" />}
              {option.label}
            </Button>
          );
        })}
      </div>
      <FormMessage />
    </div>
  );
};