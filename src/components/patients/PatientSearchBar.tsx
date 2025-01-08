import { Search } from "lucide-react";

interface PatientSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function PatientSearchBar({ value, onChange }: PatientSearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        placeholder="Search patients..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-[300px] pl-10 pr-4 py-2 text-sm rounded-full border border-gray-200
                 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/30 focus:border-[#7C3AED]
                 bg-white transition-all duration-200 
                 text-gray-900 placeholder-gray-500"
      />
    </div>
  );
}