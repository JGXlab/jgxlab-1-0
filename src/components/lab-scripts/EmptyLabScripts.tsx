import { FileText } from "lucide-react";

export const EmptyLabScripts = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-2 text-gray-600 py-8">
      <FileText className="h-8 w-8" />
      <p>No lab scripts found</p>
    </div>
  );
};