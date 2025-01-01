import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Loader2, StopCircle, CheckCircle } from "lucide-react";

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
      <Badge className="bg-green-100 text-green-800 w-full flex items-center justify-center py-1">
        <CheckCircle className="w-4 h-4 mr-1" />
        Completed
      </Badge>
    );
  }

  if (status === 'paused' || status === 'on_hold') {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-full flex items-center justify-center gap-2"
        onClick={() => onStatusUpdate(script.id, 'in_progress')}
      >
        <Play className="h-4 w-4" />
        Resume
      </Button>
    );
  }

  if (status === 'pending') {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-full flex items-center justify-center gap-2"
        onClick={() => onStatusUpdate(script.id, 'in_progress')}
      >
        <Play className="h-4 w-4" />
        Start Design
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        size="sm"
        className="w-full flex items-center justify-center gap-2"
        onClick={() => onStatusUpdate(script.id, 'paused')}
      >
        <Pause className="h-4 w-4" />
        Pause
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="w-full flex items-center justify-center gap-2"
        onClick={() => onStatusUpdate(script.id, 'on_hold')}
      >
        <StopCircle className="h-4 w-4" />
        Hold
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="w-full flex items-center justify-center gap-2"
        onClick={() => onStatusUpdate(script.id, 'completed')}
      >
        <CheckCircle className="h-4 w-4" />
        Complete
      </Button>
    </div>
  );
};