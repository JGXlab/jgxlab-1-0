import { DesignLayout } from "@/components/design/DesignLayout";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PreviewLabScriptModal } from "@/components/surgical-form/PreviewLabScriptModal";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LabScriptsTable } from "@/components/lab-scripts/LabScriptsTable";
import { StatusCardsGrid } from "@/components/lab-scripts/StatusCardsGrid";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DesignNavbar } from "@/components/design/DesignNavbar";

const DesignLabScripts = () => {
  const [selectedScript, setSelectedScript] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: labScripts, isLoading, refetch } = useQuery({
    queryKey: ['design-lab-scripts'],
    queryFn: async () => {
      console.log('Fetching all clinic lab scripts...');
      const { data, error } = await supabase
        .from('lab_scripts')
        .select(`
          *,
          patients (
            first_name,
            last_name,
            clinic_id,
            clinics (
              id,
              name,
              doctor_name
            )
          ),
          clinics (
            id,
            name,
            doctor_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching lab scripts:', error);
        throw error;
      }

      // Update clinic_id for any lab scripts that don't have it set
      const scriptsToUpdate = data?.filter(
        script => !script.clinic_id && script.patients?.clinic_id
      );

      if (scriptsToUpdate && scriptsToUpdate.length > 0) {
        console.log('Updating missing clinic IDs for lab scripts...');
        
        for (const script of scriptsToUpdate) {
          const { error: updateError } = await supabase
            .from('lab_scripts')
            .update({ clinic_id: script.patients.clinic_id })
            .eq('id', script.id);

          if (updateError) {
            console.error('Error updating clinic ID:', updateError);
          }
        }
      }

      console.log('Fetched lab scripts:', data);
      return data;
    }
  });

  const handleStatusUpdate = async (id: string, newStatus: string, reason?: string, comment?: string, designUrl?: string) => {
    try {
      console.log('Updating status with:', { id, newStatus, reason, comment, designUrl }); // Debug log
      const updateData: any = { status: newStatus };
      
      if (newStatus === 'on_hold') {
        updateData.hold_reason = reason;
        updateData.hold_comment = comment;
        if (reason === 'approval' && designUrl) {
          updateData.design_url = designUrl;
        }
      } else {
        // Clear hold data when changing to other statuses
        updateData.hold_reason = null;
        updateData.hold_comment = null;
        updateData.design_url = null;
      }

      const { error } = await supabase
        .from('lab_scripts')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: `Lab script status has been updated to ${newStatus}`,
      });

      refetch();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredLabScripts = selectedStatus === 'incomplete'
    ? labScripts?.filter(script => 
        ['pending', 'in_progress', 'paused', 'on_hold'].includes(script.status)
      )
    : selectedStatus
      ? labScripts?.filter(script => script.status === selectedStatus)
      : labScripts;

  const statusCounts = {
    new: labScripts?.filter(script => script.status === 'pending')?.length || 0,
    inProcess: labScripts?.filter(script => script.status === 'in_progress')?.length || 0,
    paused: labScripts?.filter(script => script.status === 'paused')?.length || 0,
    onHold: labScripts?.filter(script => script.status === 'on_hold')?.length || 0,
    incomplete: labScripts?.filter(script => 
      ['pending', 'in_progress', 'paused', 'on_hold'].includes(script.status)
    )?.length || 0,
    completed: labScripts?.filter(script => script.status === 'completed')?.length || 0,
    all: labScripts?.length || 0,
  };

  return (
    <DesignLayout>
      <div className="flex flex-col max-w-[1400px] w-full mx-auto h-screen py-8">
        <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
          <DesignNavbar />
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <StatusCardsGrid 
                statusCounts={statusCounts} 
                selectedStatus={selectedStatus}
                onStatusSelect={setSelectedStatus}
              />
            </div>

            <Card className="bg-gradient-to-br from-white to-accent/30 border-none shadow-lg overflow-hidden">
              <LabScriptsTable
                labScripts={filteredLabScripts || []}
                isLoading={isLoading}
                onPreview={handlePreview}
                onStatusUpdate={handleStatusUpdate}
                isDesignPortal={true}
                hideClinicColumn={false}
              />
            </Card>

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
        </ScrollArea>
      </div>
    </DesignLayout>
  );
};

export default DesignLabScripts;