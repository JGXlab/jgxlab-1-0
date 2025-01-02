import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const LabScriptsHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Lab Scripts</h2>
        <p className="text-sm text-muted-foreground">
          Manage and track your lab script requests
        </p>
      </div>
      <Button 
        onClick={() => navigate("/clinic/addnewlabscript/new")}
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Lab Script
      </Button>
    </div>
  );
};