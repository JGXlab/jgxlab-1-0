import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SelectionButton } from "./SelectionButton";

interface ArchSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const archOptions = [
  { id: "upper", label: "Upper Arch" },
  { id: "lower", label: "Lower Arch" },
  { id: "dual", label: "Dual Arch" },
];

export const ArchSelector = ({ value, onChange }: ArchSelectorProps) => {
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
        {archOptions.map((option) => {
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