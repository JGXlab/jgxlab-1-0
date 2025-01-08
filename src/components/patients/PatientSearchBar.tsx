import { Search } from "lucide-react";

interface PatientSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function PatientSearchBar({ value, onChange }: PatientSearchBarProps) {
  return (
    <div className="relative group">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A898C] group-hover:text-[#6E59A5]" />
      <input
        type="text"
        placeholder="Search patients..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-[300px] pl-10 pr-4 py-2 text-sm rounded-full border border-[#E5DEFF] 
                 focus:outline-none focus:ring-2 focus:ring-[#9b87f5]/50 
                 bg-white/50 backdrop-blur-sm transition-all duration-200 
                 hover:bg-white hover:border-[#9b87f5]
                 text-[#403E43] placeholder-[#8A898C]"
      />
    </div>
  );
}