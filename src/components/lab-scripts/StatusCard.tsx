import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatusCardProps {
  icon: LucideIcon;
  label: string;
  count: number;
  color: string;
  gradient: string;
  isHighlighted?: boolean;
}

export const StatusCard = ({ 
  icon: Icon, 
  label, 
  count, 
  color, 
  gradient,
  isHighlighted = false 
}: StatusCardProps) => (
  <Card 
    className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-32 ${
      isHighlighted ? 'border-2 border-primary' : ''
    }`}
  >
    <div className={`absolute inset-0 opacity-10 transition-opacity duration-300 group-hover:opacity-20 ${gradient}`} />
    <div className="p-4 relative z-10 h-full flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-xl ${color} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-tight animate-fade-in">{count}</span>
      </div>
      <p className="text-sm text-gray-600 text-center w-full">{label}</p>
    </div>
  </Card>
);