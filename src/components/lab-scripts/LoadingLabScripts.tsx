import { Clock } from "lucide-react";

export const LoadingLabScripts = () => {
  return (
    <div className="flex items-center justify-center space-x-2 text-gray-600 py-8">
      <Clock className="h-5 w-5 animate-spin" />
      <span>Loading lab scripts...</span>
    </div>
  );
};