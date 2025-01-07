import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface HoldDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, comment: string, designUrl?: string) => void;
}

export const HoldDialog = ({ isOpen, onClose, onSubmit }: HoldDialogProps) => {
  const [holdReason, setHoldReason] = useState<string>("");
  const [holdComment, setHoldComment] = useState<string>("");
  const [designUrl, setDesignUrl] = useState<string>("");

  const handleSubmit = () => {
    onSubmit(holdReason, holdComment, designUrl);
    setHoldReason("");
    setHoldComment("");
    setDesignUrl("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
          {holdReason === 'approval' && (
            <div className="grid gap-2">
              <Label htmlFor="design-url">Design URL</Label>
              <Input
                id="design-url"
                type="url"
                placeholder="Enter the design URL"
                value={designUrl}
                onChange={(e) => setDesignUrl(e.target.value)}
                className="bg-white"
              />
            </div>
          )}
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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!holdReason || (holdReason === 'approval' && !designUrl)}
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};