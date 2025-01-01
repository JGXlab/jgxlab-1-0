import { Clock, Loader2, Pause, StopCircle, AlertTriangle, CheckCircle, FileText } from "lucide-react";
import { StatusCard } from "./StatusCard";

interface StatusCount {
  new: number;
  inProcess: number;
  paused: number;
  onHold: number;
  incomplete: number;
  completed: number;
  all: number;
}

interface StatusCardsGridProps {
  statusCounts: StatusCount;
}

export const StatusCardsGrid = ({ statusCounts }: StatusCardsGridProps) => {
  const statusCards = [
    { 
      icon: Clock, 
      label: 'New Lab Scripts', 
      count: statusCounts.new, 
      color: 'bg-amber-500',
      gradient: 'bg-gradient-to-br from-amber-500/20 to-orange-500/20'
    },
    { 
      icon: Loader2, 
      label: 'In Process', 
      count: statusCounts.inProcess, 
      color: 'bg-blue-500',
      gradient: 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20'
    },
    { 
      icon: Pause, 
      label: 'Paused', 
      count: statusCounts.paused, 
      color: 'bg-orange-500',
      gradient: 'bg-gradient-to-br from-orange-500/20 to-red-500/20'
    },
    { 
      icon: StopCircle, 
      label: 'On Hold', 
      count: statusCounts.onHold, 
      color: 'bg-red-500',
      gradient: 'bg-gradient-to-br from-red-500/20 to-pink-500/20'
    },
    { 
      icon: AlertTriangle, 
      label: 'Incomplete', 
      count: statusCounts.incomplete, 
      color: 'bg-pink-500',
      gradient: 'bg-gradient-to-br from-pink-500/20 to-rose-500/20'
    },
    { 
      icon: CheckCircle, 
      label: 'Completed', 
      count: statusCounts.completed, 
      color: 'bg-green-500',
      gradient: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20'
    },
    { 
      icon: FileText, 
      label: 'All Scripts', 
      count: statusCounts.all, 
      color: 'bg-violet-500',
      gradient: 'bg-gradient-to-br from-violet-500/20 to-purple-500/20',
      isHighlighted: true
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {statusCards.map((card) => (
        <StatusCard
          key={card.label}
          icon={card.icon}
          label={card.label}
          count={card.count}
          color={card.color}
          gradient={card.gradient}
          isHighlighted={card.label === 'All Scripts'}
        />
      ))}
    </div>
  );
};