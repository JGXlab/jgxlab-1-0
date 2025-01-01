import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SelectionButton } from "./SelectionButton";

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
      <div className="flex flex-wrap gap-3">
        {screwTypeOptions.map((option) => {
          const isSelected = value.includes(option.id);
          return (
            <SelectionButton
              key={option.id}
              label={option.label}
              isSelected={isSelected}
              onClick={() => toggleOption(option.id)}
            />
          );
        })}
      </div>
      <FormMessage />
    </div>
  );
};