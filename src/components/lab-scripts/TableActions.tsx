import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface TableActionsProps {
  onPreview: (e: React.MouseEvent) => void;
}

export const TableActions = ({ onPreview }: TableActionsProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full flex items-center justify-center gap-2"
      onClick={onPreview}
    >
      <Eye className="h-4 w-4" />
      <span>Preview</span>
    </Button>
  );
};