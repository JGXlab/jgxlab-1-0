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
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-3 relative">
        {screwTypeOptions.map((option, index) => {
          const isSelected = value === option.id;
          // Place "Others" button in the 7th position (2nd row, 3rd column)
          const position = option.id === "others" ? 7 : index;
          return (
            <div key={option.id} className={`col-start-${(position % 4) + 1} row-start-${Math.floor(position / 4) + 1}`}>
              <SelectionButton
                label={option.label}
                isSelected={isSelected}
                onClick={() => handleOptionClick(option.id)}
              />
            </div>
          );
        })}
        {value === "others" && (
          <div className="col-start-4 row-start-2">
            <Input
              placeholder="Please specify the screw type"
              value={otherValue}
              onChange={(e) => onOtherValueChange?.(e.target.value)}
            />
          </div>
        )}
      </div>
      <FormMessage />
    </div>
  );
};