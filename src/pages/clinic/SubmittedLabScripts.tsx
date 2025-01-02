import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { LabScriptsHeader } from "@/components/lab-scripts/LabScriptsHeader";
import { PreviewLabScriptModal } from "@/components/surgical-form/PreviewLabScriptModal";
import { useState } from "react";
import { LabScriptsTable } from "@/components/lab-scripts/LabScriptsTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function SubmittedLabScripts() {
  const navigate = useNavigate();
  const [selectedScript, setSelectedScript] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { data: labScripts = [], isLoading } = useQuery({
    queryKey: ['labScripts'],
    queryFn: async () => {
      console.log('Fetching lab scripts...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from('lab_scripts')
        .select(`
          *,
          patients (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching lab scripts:', error);
        throw error;
      }

      console.log('Fetched lab scripts:', data);
      return data || [];
    },
  });

  const handlePreview = (script: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedScript(script);
    setIsPreviewOpen(true);
  };

  return (
    <ClinicLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <LabScriptsHeader />
          <Button
            onClick={() => navigate("/clinic/newlabscriptform")}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Lab Script
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <LabScriptsTable
            labScripts={labScripts}
            isLoading={isLoading}
            onPreview={handlePreview}
          />
        </div>

        {selectedScript && (
          <PreviewLabScriptModal
            isOpen={isPreviewOpen}
            onClose={() => {
              setIsPreviewOpen(false);
              setSelectedScript(null);
            }}
            labScriptId={selectedScript.id}
          />
        )}
      </div>
    </ClinicLayout>
  );
}