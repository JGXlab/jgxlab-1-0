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
      color: 'bg-[#9b87f5]',
      gradient: 'bg-gradient-to-br from-[#9b87f5]/20 to-[#7E69AB]/20',
      status: 'pending'
    },
    { 
      icon: Loader2, 
      label: 'In Process', 
      count: statusCounts.inProcess, 
      color: 'bg-[#7E69AB]',
      gradient: 'bg-gradient-to-br from-[#7E69AB]/20 to-[#6E59A5]/20',
      status: 'in_progress'
    },
    { 
      icon: Pause, 
      label: 'Paused', 
      count: statusCounts.paused, 
      color: 'bg-[#D6BCFA]',
      gradient: 'bg-gradient-to-br from-[#D6BCFA]/20 to-[#E5DEFF]/20',
      status: 'paused'
    },
    { 
      icon: StopCircle, 
      label: 'On Hold', 
      count: statusCounts.onHold, 
      color: 'bg-[#FEC6A1]',
      gradient: 'bg-gradient-to-br from-[#FEC6A1]/20 to-[#FDE1D3]/20',
      status: 'on_hold'
    },
    { 
      icon: AlertTriangle, 
      label: 'Incomplete', 
      count: statusCounts.incomplete, 
      color: 'bg-[#FFDEE2]',
      gradient: 'bg-gradient-to-br from-[#FFDEE2]/20 to-[#FDE1D3]/20',
      status: 'incomplete'
    },
    { 
      icon: CheckCircle, 
      label: 'Completed', 
      count: statusCounts.completed, 
      color: 'bg-[#F2FCE2]',
      gradient: 'bg-gradient-to-br from-[#F2FCE2]/20 to-[#FEF7CD]/20',
      status: 'completed'
    },
    { 
      icon: FileText, 
      label: 'All Scripts', 
      count: statusCounts.all, 
      color: 'bg-[#D3E4FD]',
      gradient: 'bg-gradient-to-br from-[#D3E4FD]/20 to-[#E5DEFF]/20',
      isHighlighted: true,
      status: null
    },
  ];

  return (
    <div className="grid grid-cols-7 gap-2 w-full">
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