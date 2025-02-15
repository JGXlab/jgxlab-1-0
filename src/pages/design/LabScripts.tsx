import { DesignLayout } from "@/components/design/DesignLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DesignNavbar } from "@/components/design/DesignNavbar";
import { LabScriptsTable } from "@/components/lab-scripts/LabScriptsTable";
import { useToast } from "@/hooks/use-toast";
import { PreviewLabScriptModal } from "@/components/surgical-form/PreviewLabScriptModal";
import { LabScriptsPageHeader } from "@/components/lab-scripts/LabScriptsPageHeader";

export default function LabScripts() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedScript, setSelectedScript] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: labScripts = [], isLoading, refetch } = useQuery({
    queryKey: ['designer-lab-scripts'],
    queryFn: async () => {
      console.log('Fetching lab scripts for designer...');
      const { data, error } = await supabase
        .from('lab_scripts')
        .select(`
          *,
          patients (
            first_name,
            last_name,
            clinics (
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

  const handleStatusUpdate = async (id: string, status: string, reason?: string, comment?: string, designUrl?: string) => {
    console.log('Updating status:', { id, status, reason, comment, designUrl });
    const updateData: any = { status };
    
    if (status === 'on_hold') {
      updateData.hold_reason = reason;
      updateData.hold_comment = comment;
      if (designUrl) updateData.design_url = designUrl;
    }

    if (status === 'completed') {
      updateData.completion_comment = comment;
      if (designUrl) updateData.design_download_url = designUrl;
    }

    const { error } = await supabase
      .from('lab_scripts')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Status Updated",
      description: `Lab script status has been updated to ${status}.`,
    });
    refetch();
  };

  const filteredLabScripts = selectedStatus === 'incomplete'
    ? labScripts?.filter(script => 
        ['pending', 'in_progress', 'paused', 'on_hold'].includes(script.status) &&
        (searchTerm === "" || 
          script.patients?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          script.patients?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          script.patients?.clinics?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : selectedStatus
      ? labScripts?.filter(script => 
          script.status === selectedStatus &&
          (searchTerm === "" || 
            script.patients?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            script.patients?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            script.patients?.clinics?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      : labScripts?.filter(script =>
          searchTerm === "" || 
          script.patients?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          script.patients?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          script.patients?.clinics?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );

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

  const handlePreview = (script: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedScript(script);
    setIsPreviewOpen(true);
  };

  return (
    <DesignLayout>
      <div className="flex flex-col max-w-[1400px] w-full mx-auto h-[calc(100vh-4rem)]">
        <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
          <DesignNavbar />
          <div className="px-8 pb-1 pt-6 space-y-6">
            <div className="sticky top-[57px] z-10 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg p-6">
              <LabScriptsPageHeader 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusCounts={statusCounts}
                selectedStatus={selectedStatus}
                onStatusSelect={handleStatusSelect}
                isDesignPortal={true}
              />
            </div>

            <div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-lg">
              <LabScriptsTable
                labScripts={filteredLabScripts}
                isLoading={isLoading}
                onPreview={handlePreview}
                onStatusUpdate={handleStatusUpdate}
                isDesignPortal={true}
              />
            </div>
          </div>
        </ScrollArea>

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
}