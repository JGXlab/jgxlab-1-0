import { Plus, Search } from "lucide-react";
import { StatusCardsGrid } from "./StatusCardsGrid";
import { Button } from "../ui/button";

interface LabScriptsPageHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNewLabScript?: () => void;
  statusCounts: any;
  selectedStatus: string | null;
  onStatusSelect: (status: string | null) => void;
  isDesignPortal?: boolean;
}

export function LabScriptsPageHeader({ 
  searchTerm, 
  onSearchChange, 
  onNewLabScript,
  statusCounts,
  selectedStatus,
  onStatusSelect,
  isDesignPortal = false
}: LabScriptsPageHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 min-w-0 w-full">
      <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 -mx-2 px-2">
        <StatusCardsGrid 
          statusCounts={statusCounts}
          selectedStatus={selectedStatus}
          onStatusSelect={onStatusSelect}
        />
      </div>
      <div className="flex items-center gap-4 w-full lg:w-auto">
        <div className="relative group flex-1 lg:flex-none min-w-0">
          <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-gray-600 z-10" />
          <input
            type="text"
            placeholder="Search patients or clinics..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full lg:w-[300px] pl-8 sm:pl-10 pr-2 sm:pr-4 py-1.5 sm:py-2 text-sm rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white"
          />
        </div>
        {!isDesignPortal && onNewLabScript && (
          <Button
            onClick={onNewLabScript}
            className="whitespace-nowrap shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lab Script
          </Button>
        )}
      </div>
    </div>
  );
}