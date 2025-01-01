import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface ShadeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const shadeOptions = [
  // Purples
  { id: "primary_purple", label: "Primary Purple", value: "#9b87f5" },
  { id: "secondary_purple", label: "Secondary Purple", value: "#7E69AB" },
  { id: "tertiary_purple", label: "Tertiary Purple", value: "#6E59A5" },
  { id: "dark_purple", label: "Dark Purple", value: "#1A1F2C" },
  { id: "light_purple", label: "Light Purple", value: "#D6BCFA" },
  { id: "soft_purple", label: "Soft Purple", value: "#E5DEFF" },
  { id: "vivid_purple", label: "Vivid Purple", value: "#8B5CF6" },
  
  // Other Colors
  { id: "soft_green", label: "Soft Green", value: "#F2FCE2" },
  { id: "soft_yellow", label: "Soft Yellow", value: "#FEF7CD" },
  { id: "soft_orange", label: "Soft Orange", value: "#FEC6A1" },
  { id: "soft_pink", label: "Soft Pink", value: "#FFDEE2" },
  { id: "soft_peach", label: "Soft Peach", value: "#FDE1D3" },
  { id: "soft_blue", label: "Soft Blue", value: "#D3E4FD" },
  { id: "magenta_pink", label: "Magenta Pink", value: "#D946EF" },
  { id: "bright_orange", label: "Bright Orange", value: "#F97316" },
  { id: "ocean_blue", label: "Ocean Blue", value: "#0EA5E9" },
  
  // Neutrals
  { id: "neutral_gray", label: "Neutral Gray", value: "#8E9196" },
  { id: "soft_gray", label: "Soft Gray", value: "#F1F0FB" },
  { id: "light_gray", label: "Light Gray", value: "#C8C8C9" },
  { id: "dark_gray", label: "Dark Gray", value: "#222222" },
  { id: "medium_gray", label: "Medium Gray", value: "#8A898C" },
  { id: "pure_white", label: "Pure White", value: "#FFFFFF" },
];

export const ShadeSelector = ({ value, onChange }: ShadeSelectorProps) => {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-full bg-white">
        <SelectValue placeholder="Select a shade" />
      </SelectTrigger>
      <SelectContent>
        <div className="max-h-[300px] overflow-y-auto">
          {shadeOptions.map((shade) => (
            <SelectItem
              key={shade.id}
              value={shade.id}
              className="flex items-center gap-2"
            >
              <div
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: shade.value }}
              />
              {shade.label}
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  );
};
