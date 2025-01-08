import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, History } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PatientActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onViewHistory: () => void;
}

export function PatientActions({ onEdit, onDelete, onViewHistory }: PatientActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onViewHistory}
              className="h-8 w-8 rounded-full hover:bg-[#E5DEFF] hover:text-[#6E59A5] text-[#8A898C]"
            >
              <History className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View History</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
              className="h-8 w-8 rounded-full hover:bg-[#E5DEFF] hover:text-[#6E59A5] text-[#8A898C]"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit Patient</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8 rounded-full hover:bg-[#FFDEE2] hover:text-red-500 text-[#8A898C]"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete Patient</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}