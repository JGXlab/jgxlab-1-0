import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { NewLabScriptDialog } from "./NewLabScriptDialog";

export const LabScriptsHeader = () => {
  const [showNewLabScript, setShowNewLabScript] = useState(false);
  
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Lab Scripts</h2>
          <p className="text-sm text-muted-foreground">
            Manage and track your lab script requests
          </p>
        </div>
        <Button 
          onClick={() => setShowNewLabScript(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Lab Script
        </Button>
      </div>

      <NewLabScriptDialog 
        isOpen={showNewLabScript}
        onClose={() => setShowNewLabScript(false)}
      />
    </>
  );
};