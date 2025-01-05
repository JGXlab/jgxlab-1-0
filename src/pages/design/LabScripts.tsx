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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { toast } = useToast();

  const { data: labScripts, isLoading } = useQuery({
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
            user_id
          ),
          clinics:patients!inner(
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
      return data;
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
      <div className="flex flex-col max-w-[1400px] w-full mx-auto min-h-screen">
        <div className="sticky top-0 z-50 w-full bg-gradient-to-br from-[#F8F9FD] to-[#E9EBFF] pb-4">
          <DesignNavbar 
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        </div>
        
        <ScrollArea className="flex-1 px-6 py-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <StatusCardsGrid 
                statusCounts={statusCounts} 
                selectedStatus={selectedStatus}
                onStatusSelect={handleStatusSelect}
              />
            </div>

            <Card className="bg-gradient-to-br from-white to-accent/30 border-none shadow-lg overflow-hidden">
              <LabScriptsTable
                labScripts={filteredLabScripts || []}
                isLoading={isLoading}
                onPreview={handlePreview}
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