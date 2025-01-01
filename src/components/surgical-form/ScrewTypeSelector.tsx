import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrewTypeSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const screwTypeOptions = [
  { id: "dc", label: "DC Screw" },
  { id: "rosen", label: "Rosen" },
  { id: "powerball", label: "Powerball" },
  { id: "dess", label: "Dess" },
  { id: "sin", label: "SIN" },
  { id: "neodent", label: "Neodent" },
  { id: "others", label: "Others" },
];

export const ScrewTypeSelector = ({ value, onChange }: ScrewTypeSelectorProps) => {
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
        {screwTypeOptions.map((option) => {
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