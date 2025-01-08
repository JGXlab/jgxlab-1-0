import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface PreviewHeaderProps {
  onDownload: () => void;
}

export const PreviewHeader = ({ onDownload }: PreviewHeaderProps) => {
  return (
    <DialogHeader className="flex flex-row items-center justify-between p-6 border-b bg-gray-50/50">
      <DialogTitle className="text-xl font-semibold text-gray-900">
        Lab Script Preview
      </DialogTitle>
      <Button 
        onClick={onDownload} 
        size="icon" 
        variant="outline"
        title="Save as PDF"
        className="h-9 w-9 transition-colors hover:bg-gray-100"
      >
        <Download className="h-4 w-4" />
      </Button>
    </DialogHeader>
  );
};