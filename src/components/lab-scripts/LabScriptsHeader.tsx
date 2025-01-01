import { FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const LabScriptsHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">Lab Scripts</h1>
        <p className="text-sm text-white/70">
          Manage and track your submitted lab scripts
        </p>
      </div>
      <Button 
        onClick={() => navigate("/clinic/new-lab-script")}
        className="bg-primary hover:bg-primary-hover transition-colors"
      >
        <FilePlus className="mr-2 h-4 w-4" />
        New Lab Script
      </Button>
    </div>
  );
};