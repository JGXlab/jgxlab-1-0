import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SelectionButton } from "./SelectionButton";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ScrewTypeSelectorProps {
  value: string;
  onChange: (value: string, otherValue?: string) => void;
  otherValue?: string;
  onOtherValueChange?: (value: string) => void;
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

export const ScrewTypeSelector = ({ value, onChange, otherValue, onOtherValueChange }: ScrewTypeSelectorProps) => {
  const handleOptionClick = (optionId: string) => {
    onChange(optionId);
    if (optionId !== 'others') {
      onOtherValueChange?.('');
    }
  };

  const handleOtherValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onOtherValueChange?.(newValue);
    // Trigger form validation
    onChange('others', newValue);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-3 relative">
        {screwTypeOptions.map((option) => {
          const isSelected = value === option.id;
          return (
            <SelectionButton
              key={option.id}
              label={option.label}
              isSelected={isSelected}
              onClick={() => handleOptionClick(option.id)}
            />
          );
        })}
        {value === "others" && (
          <div className="col-start-4 w-40">
            <Input
              placeholder="*Specify Please"
              value={otherValue}
              onChange={handleOtherValueChange}
              className="bg-white text-gray-900 placeholder:text-gray-500"
              required
            />
          </div>
        )}
      </div>
      <FormMessage />
    </div>
  );
};