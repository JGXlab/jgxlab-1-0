import { Clock, Loader, Pause, SquareX, AlertTriangle, CheckCircle, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StatusCardProps {
  label: string;
  count: number;
  color: string;
  isHighlighted?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

const getStatusIcon = (label: string) => {
  switch (label) {
    case 'New':
      return <Clock className="w-5 h-5 text-[#f59e0b]" />;
    case 'In Process':
      return <Loader className="w-5 h-5 text-[#3b82f6]" />;
    case 'Paused':
      return <Pause className="w-5 h-5 text-[#f97316]" />;
    case 'On Hold':
      return <SquareX className="w-5 h-5 text-[#ef4444]" />;
    case 'Incomplete':
      return <AlertTriangle className="w-5 h-5 text-[#ec4899]" />;
    case 'Completed':
      return <CheckCircle className="w-5 h-5 text-[#22c55e]" />;
    case 'All':
      return <FileText className="w-5 h-5 text-[#9b87f5]" />;
    default:
      return null;
  }
};

const getProgressColor = (label: string) => {
  switch (label) {
    case 'New':
      return 'bg-[#f59e0b]';
    case 'In Process':
      return 'bg-[#3b82f6]';
    case 'Paused':
      return 'bg-[#f97316]';
    case 'On Hold':
      return 'bg-[#ef4444]';
    case 'Incomplete':
      return 'bg-[#ec4899]';
    case 'Completed':
      return 'bg-[#22c55e]';
    case 'All':
      return 'bg-[#9b87f5]';
    default:
      return '';
  }
};

export const StatusCard = ({ 
  label, 
  count, 
  isHighlighted = false,
  isSelected = false,
  onClick 
}: StatusCardProps) => (
  <div 
    className={`
      relative p-4 rounded-lg cursor-pointer transition-all duration-300
      hover:shadow-md hover:-translate-y-0.5 bg-white
      ${isSelected ? 'ring-2 ring-[#9b87f5] shadow-sm' : ''}
      ${isHighlighted ? 'border border-[#9b87f5]' : ''}
      min-w-[200px]
    `}
    onClick={onClick}
  >
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2 rounded-lg ${label === 'New' ? 'bg-[#fff7ed]' : 
                                      label === 'In Process' ? 'bg-[#eff6ff]' :
                                      label === 'Paused' ? 'bg-[#fff7ed]' :
                                      label === 'On Hold' ? 'bg-[#fef2f2]' :
                                      label === 'Incomplete' ? 'bg-[#fdf2f8]' :
                                      label === 'Completed' ? 'bg-[#f0fdf4]' :
                                      'bg-[#9b87f5]/10'}`}>
        {getStatusIcon(label)}
      </div>
      <span className="text-2xl font-semibold text-gray-900">{count}</span>
    </div>
    <div className="space-y-2">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div 
          className={`h-full rounded-full ${getProgressColor(label)}`} 
          style={{ width: '100%' }}
        />
      </div>
    </div>
  </div>
);