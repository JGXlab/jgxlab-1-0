import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface TreatmentTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  selectedArch: string[];
}

export const TreatmentTypeSelector = ({ value, onChange, selectedArch }: TreatmentTypeSelectorProps) => {
  const getTreatmentOptions = () => {
    if (selectedArch.includes('upper')) {
      return [{ value: 'upper-treatment', label: 'Upper Treatment' }];
    }
    if (selectedArch.includes('lower')) {
      return [{ value: 'lower-treatment', label: 'Lower Treatment' }];
    }
    if (selectedArch.includes('dual')) {
      return [{ value: 'dual-treatment', label: 'Upper and Lower Treatment' }];
    }
    return [];
  };

  const options = getTreatmentOptions();

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="bg-white">
        <SelectValue placeholder="Select treatment type" />
      </SelectTrigger>
      <SelectContent className="bg-white z-50">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};