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
  const hasUpperArch = selectedArch.includes('upper');
  const hasLowerArch = selectedArch.includes('lower');
  const hasDualArch = selectedArch.includes('dual');

  // Parse the combined value into upper and lower parts
  const [upperValue, lowerValue] = value.split('|');

  const handleChange = (newValue: string, position: 'upper' | 'lower') => {
    if (position === 'upper') {
      onChange(`${newValue}|${lowerValue || ''}`);
    } else {
      onChange(`${upperValue || ''}|${newValue}`);
    }
  };

  if (hasDualArch) {
    return (
      <Select onValueChange={onChange} value={value}>
        <SelectTrigger className="bg-white">
          <SelectValue placeholder="Select treatment type" />
        </SelectTrigger>
        <SelectContent className="bg-white z-50">
          <SelectItem value="dual-treatment">Upper and Lower Treatment</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className="space-y-4">
      {hasUpperArch && (
        <div className="space-y-2">
          <FormLabel>Upper Treatment Type</FormLabel>
          <Select onValueChange={(v) => handleChange(v, 'upper')} value={upperValue}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select upper treatment type" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="upper-treatment">Upper Treatment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      {hasLowerArch && (
        <div className="space-y-2">
          <FormLabel>Lower Treatment Type</FormLabel>
          <Select onValueChange={(v) => handleChange(v, 'lower')} value={lowerValue}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select lower treatment type" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="lower-treatment">Lower Treatment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};