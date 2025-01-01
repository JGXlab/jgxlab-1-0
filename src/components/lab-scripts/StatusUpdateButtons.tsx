import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, StopCircle, CheckCircle } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StatusUpdateButtonsProps {
  script: {
    id: string;
    status: string;
  };
  onStatusUpdate: (id: string, status: string) => void;
}

export const StatusUpdateButtons = ({ script, onStatusUpdate }: StatusUpdateButtonsProps) => {
  const status = script.status.toLowerCase();

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
    <div className="flex gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
              onClick={() => onStatusUpdate(script.id, 'paused')}
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
              onClick={() => onStatusUpdate(script.id, 'on_hold')}
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
              onClick={() => onStatusUpdate(script.id, 'completed')}
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