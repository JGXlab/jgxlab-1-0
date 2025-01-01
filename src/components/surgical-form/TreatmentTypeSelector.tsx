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
  const isDualArch = selectedArch[0] === 'dual';
  const isUpperArch = selectedArch[0] === 'upper';
  const isLowerArch = selectedArch[0] === 'lower';

  // Parse the combined value into upper and lower parts, with proper initialization
  const [upperValue, lowerValue] = (value || '|').split('|');

  const handleChange = (newValue: string, position: 'upper' | 'lower') => {
    if (position === 'upper') {
      onChange(`${newValue}|${lowerValue || ''}`);
    } else {
      onChange(`${upperValue || ''}|${newValue}`);
    }
  };

  const treatmentOptions = [
    { value: "full-arch-fixed", label: "Full Arch Fixed" },
    { value: "denture", label: "Denture" },
    { value: "one-piece-implant", label: "One Piece Implant" },
  ];

  if (isDualArch) {
    return (
      <div className="flex gap-4">
        <div className="flex-1">
          <Select onValueChange={(v) => handleChange(v, 'upper')} value={upperValue}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select upper treatment" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              {treatmentOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <Select onValueChange={(v) => handleChange(v, 'lower')} value={lowerValue}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select lower treatment" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              {treatmentOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  if (isUpperArch) {
    return (
      <div>
        <Select onValueChange={(v) => handleChange(v, 'upper')} value={upperValue}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select upper treatment" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            {treatmentOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (isLowerArch) {
    return (
      <div>
        <Select onValueChange={(v) => handleChange(v, 'lower')} value={lowerValue}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select lower treatment" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            {treatmentOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return null;
};