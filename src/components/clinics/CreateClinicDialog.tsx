import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { CreateClinicForm } from "./CreateClinicForm";

export function CreateClinicDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary-hover text-white transition-colors gap-2">
          <Plus className="h-4 w-4" />
          Create Clinic
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-[#1A1F2C]">Create New Clinic</DialogTitle>
        </DialogHeader>
        <CreateClinicForm />
      </DialogContent>
    </Dialog>
  );
}