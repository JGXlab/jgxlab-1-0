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
    className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-24 cursor-pointer ${
      isHighlighted ? 'border-2 border-primary' : ''
    } ${
      isSelected ? 'ring-2 ring-primary shadow-lg' : ''
    }`}
    onClick={onClick}
  >
    <div className={`absolute inset-0 opacity-10 transition-opacity duration-300 group-hover:opacity-20 ${gradient}`} />
    <div className="p-2 relative z-10 h-full flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className={`p-1.5 rounded-lg ${color} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="w-3 h-3 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight animate-fade-in">{count}</span>
      </div>
      <p className="text-xs text-gray-600 text-center w-full truncate">{label}</p>
    </div>
  </Card>
);