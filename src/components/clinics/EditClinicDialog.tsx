import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditClinicForm } from "./EditClinicForm";
import { Pencil } from "lucide-react";
import { Clinic } from "./types";

interface EditClinicDialogProps {
  clinic: Clinic;
}

export function EditClinicDialog({ clinic }: EditClinicDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-white border-[#E5DEFF] text-[#7E69AB] hover:bg-[#F1F0FB] hover:text-[#6E59A5] transition-colors"
        >
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-[#1A1F2C]">Edit Clinic</DialogTitle>
        </DialogHeader>
        <EditClinicForm clinic={clinic} />
      </DialogContent>
    </Dialog>
  );
}