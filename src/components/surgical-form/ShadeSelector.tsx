import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ShadeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const shadeOptions = [
  { id: "a1", label: "A1" },
  { id: "a2", label: "A2" },
  { id: "a3", label: "A3" },
  { id: "a3_5", label: "A3.5" },
  { id: "a4", label: "A4" },
  { id: "b1", label: "B1" },
  { id: "b2", label: "B2" },
  { id: "b3", label: "B3" },
  { id: "c1", label: "C1" },
  { id: "c2", label: "C2" },
  { id: "c3", label: "C3" },
  { id: "d2", label: "D2" },
  { id: "d3", label: "D3" },
  { id: "nw", label: "NW" },
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
              {shade.label}
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  );
};