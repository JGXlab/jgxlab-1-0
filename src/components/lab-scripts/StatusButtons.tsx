import { Button } from "@/components/ui/button";
import { TooltipProvider, TooltipTrigger, TooltipContent, Tooltip } from "@/components/ui/tooltip";
import { Play, Pause, StopCircle, CheckCircle } from "lucide-react";

interface StatusButtonsProps {
  onPause: () => void;
  onHold: () => void;
  onComplete: () => void;
}

export const StatusButtons = ({ onPause, onHold, onComplete }: StatusButtonsProps) => {
  return (
    <div className="flex gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
              onClick={onPause}
            >
              <Pause className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Pause</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
              onClick={onHold}
            >
              <StopCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hold</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
              onClick={onComplete}
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Complete</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};