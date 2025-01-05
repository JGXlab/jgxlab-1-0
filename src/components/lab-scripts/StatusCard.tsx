import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatusCardProps {
  icon: LucideIcon;
  label: string;
  count: number;
  color: string;
  gradient: string;
  isHighlighted?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

export const StatusCard = ({ 
  icon: Icon, 
  label, 
  count, 
  color, 
  gradient,
  isHighlighted = false,
  isSelected = false,
  onClick 
}: StatusCardProps) => (
  <Card 
    className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 h-16 cursor-pointer ${
      isHighlighted ? 'border border-[#9b87f5]' : ''
    } ${
      isSelected ? 'ring-1 ring-[#9b87f5] shadow-sm' : ''
    }`}
    onClick={onClick}
  >
    <div className={`absolute inset-0 opacity-10 transition-opacity duration-300 group-hover:opacity-20 ${gradient}`} />
    <div className="p-2 relative z-10 h-full flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className={`p-1 rounded-md ${color} transition-transform duration-300 group-hover:scale-105`}>
          <Icon className="w-3 h-3 text-gray-700" />
        </div>
        <span className="text-sm font-semibold tracking-tight animate-fade-in">{count}</span>
      </div>
      <p className="text-[10px] text-gray-600 text-left w-full truncate">{label}</p>
    </div>
  </Card>
);