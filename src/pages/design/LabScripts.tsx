import { DesignLayout } from "@/components/design/DesignLayout";
import { Card } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingLabScripts } from "@/components/lab-scripts/LoadingLabScripts";
import { EmptyLabScripts } from "@/components/lab-scripts/EmptyLabScripts";
import { PreviewLabScriptModal } from "@/components/surgical-form/PreviewLabScriptModal";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LabScriptsTable } from "@/components/lab-scripts/LabScriptsTable";
import { StatusCardsGrid } from "@/components/lab-scripts/StatusCardsGrid";
import { LabScriptsHeader } from "@/components/lab-scripts/LabScriptsHeader";

const DesignLabScripts = () => {
  const [selectedScript, setSelectedScript] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: labScripts, isLoading } = useQuery({
    queryKey: ['design-lab-scripts'],
    queryFn: async () => {
      console.log('Fetching lab scripts for designer...');
      const { data, error } = await supabase
        .from('lab_scripts')
        .select(`
          *,
          patients (
            first_name,
            last_name
          ),
          profiles:profiles!lab_scripts_user_id_fkey (
            clinics!clinics_user_id_fkey (
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

      // Transform the data to match the expected interface
      const transformedData = data.map(script => ({
        ...script,
        clinics: script.profiles?.clinics?.[0] || null
      }));

      console.log('Fetched lab scripts:', transformedData);
      return transformedData;
    }
  });

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

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('lab_scripts')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['design-lab-scripts'] });
      toast({
        title: "Status Updated",
        description: "Lab script status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
      console.error('Error updating status:', error);
    },
  });

  const handleStatusUpdate = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handlePreview = (script: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedScript(script);
    setIsPreviewOpen(true);
  };

  const handleStatusSelect = (status: string | null) => {
    setSelectedStatus(status);
    let toastMessage = "";
    if (status === 'incomplete') {
      toastMessage = "Showing all incomplete lab scripts (New, In Process, Paused, and On Hold)";
    } else if (status) {
      toastMessage = `Filtered by ${status.replace('_', ' ')}`;
    } else {
      toastMessage = "Showing all lab scripts";
    }
    
    toast({
      title: toastMessage,
      description: "Click 'All Scripts' to clear filter",
    });
  };

  return (
    <DesignLayout>
      <div className="space-y-8 p-8 animate-fade-in">
        <LabScriptsHeader />
        
        <StatusCardsGrid 
          statusCounts={statusCounts} 
          selectedStatus={selectedStatus}
          onStatusSelect={handleStatusSelect}
        />

        <Card className="p-6 backdrop-blur-sm bg-white/50 shadow-lg">
          {isLoading ? (
            <LoadingLabScripts />
          ) : !filteredLabScripts?.length ? (
            <EmptyLabScripts />
          ) : (
            <LabScriptsTable
              labScripts={filteredLabScripts}
              onPreview={handlePreview}
              onStatusUpdate={handleStatusUpdate}
            />
          )}
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
    </DesignLayout>
  );
};

export default DesignLabScripts;