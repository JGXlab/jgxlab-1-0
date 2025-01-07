import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, StopCircle, CheckCircle } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface StatusUpdateButtonsProps {
  script: {
    id: string;
    status: string;
  };
  onStatusUpdate: (id: string, status: string, reason?: string, comment?: string) => void;
}

export const StatusUpdateButtons = ({ script, onStatusUpdate }: StatusUpdateButtonsProps) => {
  const [showHoldDialog, setShowHoldDialog] = useState(false);
  const [holdReason, setHoldReason] = useState<string>("");
  const [holdComment, setHoldComment] = useState<string>("");
  const status = script.status.toLowerCase();

  const handleHoldSubmit = () => {
    onStatusUpdate(script.id, 'on_hold', holdReason, holdComment);
    setShowHoldDialog(false);
    setHoldReason("");
    setHoldComment("");
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
                onClick={() => setShowHoldDialog(true)}
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

      <Dialog open={showHoldDialog} onOpenChange={setShowHoldDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Hold Design</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="hold-reason">Reason for Hold</Label>
              <Select
                value={holdReason}
                onValueChange={setHoldReason}
              >
                <SelectTrigger id="hold-reason" className="bg-white">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="incomplete_info">Hold for incomplete info</SelectItem>
                  <SelectItem value="incomplete_3d">Hold for incomplete 3D data</SelectItem>
                  <SelectItem value="approval">Hold for approval</SelectItem>
                  <SelectItem value="clinic_request">Clinic asked to hold the design</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hold-comment">Additional Comments</Label>
              <Textarea
                id="hold-comment"
                value={holdComment}
                onChange={(e) => setHoldComment(e.target.value)}
                placeholder="Add any additional comments..."
                className="h-24 bg-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowHoldDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleHoldSubmit}
              disabled={!holdReason}
            >
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};