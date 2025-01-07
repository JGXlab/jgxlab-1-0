import { Button } from "@/components/ui/button";
import { Pencil, Trash2, History } from "lucide-react";

interface PatientActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onViewHistory: () => void;
}

export function PatientActions({ onEdit, onDelete, onViewHistory }: PatientActionsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onViewHistory}
        className="text-primary hover:text-primary hover:bg-primary/10 border-primary/20"
      >
        <History className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="text-primary hover:text-primary hover:bg-primary/10 border-primary/20"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onDelete}
        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}