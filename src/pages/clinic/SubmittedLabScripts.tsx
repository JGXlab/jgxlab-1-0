import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LabScriptsHeader } from "@/components/lab-scripts/LabScriptsHeader";
import { LabScriptsTable } from "@/components/lab-scripts/LabScriptsTable";
import { PreviewLabScriptModal } from "@/components/surgical-form/PreviewLabScriptModal";
import { EmptyLabScripts } from "@/components/lab-scripts/EmptyLabScripts";
import { LoadingLabScripts } from "@/components/lab-scripts/LoadingLabScripts";

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
            last_name,
            user_id
          ),
          clinics:patient_id (
            clinics:clinic_id (
              name,
              doctor_name
            )
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
      <div className="mx-auto max-w-5xl space-y-6">
        <LabScriptsHeader />
        
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          {isLoading ? (
            <LoadingLabScripts />
          ) : labScripts.length === 0 ? (
            <EmptyLabScripts />
          ) : (
            <LabScriptsTable 
              labScripts={labScripts}
              onPreview={handlePreview}
              onStatusUpdate={() => {}}
            />
          )}
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