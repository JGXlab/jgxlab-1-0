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
  selectedStatus: string | null;
  onStatusSelect: (status: string | null) => void;
}

export const StatusCardsGrid = ({ statusCounts, selectedStatus, onStatusSelect }: StatusCardsGridProps) => {
  const statusCards = [
    { 
      icon: Clock, 
      label: 'New Lab Scripts', 
      count: statusCounts.new, 
      color: 'bg-amber-500',
      gradient: 'bg-gradient-to-br from-amber-500/20 to-orange-500/20',
      status: 'pending'
    },
    { 
      icon: Loader2, 
      label: 'In Process', 
      count: statusCounts.inProcess, 
      color: 'bg-blue-500',
      gradient: 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20',
      status: 'in_progress'
    },
    { 
      icon: Pause, 
      label: 'Paused', 
      count: statusCounts.paused, 
      color: 'bg-orange-500',
      gradient: 'bg-gradient-to-br from-orange-500/20 to-red-500/20',
      status: 'paused'
    },
    { 
      icon: StopCircle, 
      label: 'On Hold', 
      count: statusCounts.onHold, 
      color: 'bg-red-500',
      gradient: 'bg-gradient-to-br from-red-500/20 to-pink-500/20',
      status: 'on_hold'
    },
    { 
      icon: AlertTriangle, 
      label: 'Incomplete', 
      count: statusCounts.incomplete, 
      color: 'bg-pink-500',
      gradient: 'bg-gradient-to-br from-pink-500/20 to-rose-500/20',
      status: 'incomplete'
    },
    { 
      icon: CheckCircle, 
      label: 'Completed', 
      count: statusCounts.completed, 
      color: 'bg-green-500',
      gradient: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
      status: 'completed'
    },
    { 
      icon: FileText, 
      label: 'All Scripts', 
      count: statusCounts.all, 
      color: 'bg-violet-500',
      gradient: 'bg-gradient-to-br from-violet-500/20 to-purple-500/20',
      isHighlighted: true,
      status: null
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 max-w-[900px] mx-auto">
      {statusCards.map((card) => (
        <StatusCard
          key={card.label}
          icon={card.icon}
          label={card.label}
          count={card.count}
          color={card.color}
          gradient={card.gradient}
          isHighlighted={card.isHighlighted}
          isSelected={selectedStatus === card.status}
          onClick={() => onStatusSelect(card.status)}
        />
      ))}
    </div>
  );
};