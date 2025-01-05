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
    <div className="flex justify-between items-center">
      <StatusCardsGrid 
        statusCounts={statusCounts}
        selectedStatus={selectedStatus}
        onStatusSelect={onStatusSelect}
      />
      <div className="flex items-center gap-4">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-gray-600 z-10" />
          <input
            type="text"
            placeholder="Search lab scripts..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-full border border-gray-200 w-48 focus:outline-none focus:ring-2 focus:ring-primary bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white"
          />
        </div>
        <Button
          onClick={onNewLabScript}
          className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Lab Script
        </Button>
      </div>
    </div>
  );
}