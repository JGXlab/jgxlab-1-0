import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PatientSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const PatientSearchBar = ({ value, onChange }: PatientSearchBarProps) => {
  return (
    <div className="relative w-[300px]">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
      <Input
        type="text"
        placeholder="Search patients..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-4 w-full bg-background border-input hover:border-ring focus-visible:ring-1 focus-visible:ring-ring transition-colors"
      />
    </div>
  );
};