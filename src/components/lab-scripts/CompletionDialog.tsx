import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface CompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comment: string, downloadUrl: string) => void;
}

export const CompletionDialog = ({
  isOpen,
  onClose,
  onSubmit,
}: CompletionDialogProps) => {
  const [comment, setComment] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleSubmit = () => {
    onSubmit(comment, downloadUrl);
    setComment("");
    setDownloadUrl("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Design</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              Completion Comment
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add any final notes about the design..."
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="downloadUrl" className="text-sm font-medium">
              Design Download URL
            </label>
            <Input
              id="downloadUrl"
              value={downloadUrl}
              onChange={(e) => setDownloadUrl(e.target.value)}
              placeholder="Enter Dropbox link for the design file..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Complete Design</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};