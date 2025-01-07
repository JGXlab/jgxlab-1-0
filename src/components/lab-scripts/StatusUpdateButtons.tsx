import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle } from "lucide-react";
import { TooltipProvider, TooltipTrigger, TooltipContent, Tooltip } from "@/components/ui/tooltip";
import { useState } from "react";
import { HoldDialog } from "./HoldDialog";
import { StatusButtons } from "./StatusButtons";

interface StatusUpdateButtonsProps {
  script: {
    id: string;
    status: string;
  };
  onStatusUpdate: (id: string, status: string, reason?: string, comment?: string, designUrl?: string) => void;
}

export const StatusUpdateButtons = ({ script, onStatusUpdate }: StatusUpdateButtonsProps) => {
  const [showHoldDialog, setShowHoldDialog] = useState(false);
  const status = script.status.toLowerCase();

  const handleHoldSubmit = (reason: string, comment: string, designUrl?: string) => {
    onStatusUpdate(script.id, 'on_hold', reason, comment, designUrl);
    setShowHoldDialog(false);
  };

  if (status === 'completed') {
    return (
      <Badge className="bg-green-100 text-green-800 w-8 h-8 flex items-center justify-center p-0">
        <CheckCircle className="w-4 h-4" />
      </Badge>
    );
  }

  if (status === 'paused' || status === 'on_hold') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
              onClick={() => onStatusUpdate(script.id, 'in_progress')}
            >
              <Play className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Resume</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (status === 'pending') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
              onClick={() => onStatusUpdate(script.id, 'in_progress')}
            >
              <Play className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Start Design</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <>
      <StatusButtons
        onPause={() => onStatusUpdate(script.id, 'paused')}
        onHold={() => setShowHoldDialog(true)}
        onComplete={() => onStatusUpdate(script.id, 'completed')}
      />

      <HoldDialog
        isOpen={showHoldDialog}
        onClose={() => setShowHoldDialog(false)}
        onSubmit={handleHoldSubmit}
      />
    </>
  );
};