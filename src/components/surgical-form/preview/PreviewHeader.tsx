import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface PreviewHeaderProps {
  onDownload: () => void;
}

export const PreviewHeader = ({ onDownload }: PreviewHeaderProps) => {
  return (
    <DialogHeader className="flex flex-row items-center justify-between">
      <DialogTitle className="text-2xl font-semibold text-gray-900">
        Lab Script Preview
      </DialogTitle>
      <Button 
        onClick={onDownload} 
        size="icon" 
        variant="outline"
        title="Save as PDF"
      >
        <Download className="h-4 w-4" />
      </Button>
    </DialogHeader>
  );
};