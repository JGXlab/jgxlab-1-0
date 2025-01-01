import { FileText, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const EmptyLabScripts = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center space-y-2 text-gray-600 py-8">
      <FileText className="h-8 w-8" />
      <p>No lab scripts found. Create your first one!</p>
      <Button 
        variant="outline" 
        onClick={() => navigate("/clinic/new-lab-script")}
        className="mt-2"
      >
        <FilePlus className="mr-2 h-4 w-4" />
        Create Lab Script
      </Button>
    </div>
  );
};