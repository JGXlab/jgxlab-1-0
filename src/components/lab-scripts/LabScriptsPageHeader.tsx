import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { StatusCardsGrid } from "./StatusCardsGrid";

interface LabScriptsPageHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNewLabScript: () => void;
  statusCounts: any;
  selectedStatus: string | null;
  onStatusSelect: (status: string | null) => void;
}

export function LabScriptsPageHeader({ 
  searchTerm, 
  onSearchChange, 
  onNewLabScript,
  statusCounts,
  selectedStatus,
  onStatusSelect
}: LabScriptsPageHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 min-w-0">
      <div className="w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
        <StatusCardsGrid 
          statusCounts={statusCounts}
          selectedStatus={selectedStatus}
          onStatusSelect={onStatusSelect}
        />
      </div>
      <div className="flex items-center gap-2 sm:gap-4 w-full lg:w-auto shrink-0">
        <div className="relative group flex-1 lg:flex-none min-w-0">
          <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-gray-600 z-10" />
          <input
            type="text"
            placeholder="Search lab scripts..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full lg:w-[200px] pl-8 sm:pl-10 pr-2 sm:pr-4 py-1.5 sm:py-2 text-sm rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white"
          />
        </div>
        <Button
          onClick={onNewLabScript}
          className="whitespace-nowrap bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full px-3 sm:px-6 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 transition-all duration-200 shadow-sm hover:shadow-md text-sm shrink-0"
        >
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Add Lab Script
        </Button>
      </div>
    </div>
  );
}