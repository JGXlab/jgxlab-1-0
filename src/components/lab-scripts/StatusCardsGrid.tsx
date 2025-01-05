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
      label: 'New', 
      count: statusCounts.new, 
      color: 'bg-[#E5DEFF]',
      status: 'pending'
    },
    { 
      label: 'In Process', 
      count: statusCounts.inProcess, 
      color: 'bg-[#D6BCFA]',
      status: 'in_progress'
    },
    { 
      label: 'Paused', 
      count: statusCounts.paused, 
      color: 'bg-[#FEC6A1]',
      status: 'paused'
    },
    { 
      label: 'On Hold', 
      count: statusCounts.onHold, 
      color: 'bg-[#FFDEE2]',
      status: 'on_hold'
    },
    { 
      label: 'Incomplete', 
      count: statusCounts.incomplete, 
      color: 'bg-[#F2FCE2]',
      status: 'incomplete'
    },
    { 
      label: 'Completed', 
      count: statusCounts.completed, 
      color: 'bg-[#D3E4FD]',
      status: 'completed'
    },
    { 
      label: 'All', 
      count: statusCounts.all, 
      color: 'bg-[#9b87f5]/20',
      isHighlighted: true,
      status: null
    },
  ];

  return (
    <div className="flex flex-nowrap gap-2 items-center overflow-x-auto pb-2 min-w-0 w-full">
      {statusCards.map((card) => (
        <StatusCard
          key={card.label}
          label={card.label}
          count={card.count}
          color={card.color}
          isHighlighted={card.isHighlighted}
          isSelected={selectedStatus === card.status}
          onClick={() => onStatusSelect(card.status)}
        />
      ))}
    </div>
  );
};