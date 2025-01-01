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
        <Button variant="outline" size="sm" className="mr-2">
          <Pencil className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">Edit Clinic</DialogTitle>
        </DialogHeader>
        <EditClinicForm clinic={clinic} />
      </DialogContent>
    </Dialog>
  );
}