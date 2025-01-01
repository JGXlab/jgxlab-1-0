import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SelectionButton } from "./SelectionButton";

interface VDODetailsSelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const vdoDetailsOptions = [
  { id: "open_4mm_no_call", label: "Open upto 4 mm without calling Doctor" },
  { id: "open_4mm_with_call", label: "Open upto 4 mm with calling Doctor" },
  { id: "open_vdo_requirement", label: "Open VDO based on requirement" },
  { id: "no_changes", label: "No changes required in VDO" },
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
      <div className="flex flex-wrap gap-3">
        {vdoDetailsOptions.map((option) => {
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