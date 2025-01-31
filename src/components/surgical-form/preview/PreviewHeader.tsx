import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const PreviewHeader = () => {
  return (
    <DialogHeader className="flex flex-row items-center justify-between p-6 border-b bg-gray-50/50">
      <DialogTitle className="text-xl font-semibold text-gray-900">
        Lab Script Preview
      </DialogTitle>
    </DialogHeader>
  );
};