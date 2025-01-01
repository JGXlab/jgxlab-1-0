import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SelectionButton } from "./SelectionButton";

interface NightguardSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const NightguardSelector = ({ value, onChange }: NightguardSelectorProps) => {
  const handleOptionClick = (optionId: string) => {
    onChange(optionId);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        <SelectionButton
          label="Yes"
          isSelected={value === "yes"}
          onClick={() => handleOptionClick("yes")}
        />
        <SelectionButton
          label="No"
          isSelected={value === "no"}
          onClick={() => handleOptionClick("no")}
        />
      </div>
      <FormMessage />
    </div>
  );
};