import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Clock, Loader2, Pause, StopCircle, AlertTriangle, CheckCircle, FileText } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingLabScripts } from "@/components/lab-scripts/LoadingLabScripts";
import { EmptyLabScripts } from "@/components/lab-scripts/EmptyLabScripts";
import { PreviewLabScriptModal } from "@/components/surgical-form/PreviewLabScriptModal";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LabScriptsTable } from "@/components/lab-scripts/LabScriptsTable";

const StatusCard = ({ icon: Icon, label, count, color }: { 
  icon: any; 
  label: string; 
  count: number;
  color: string;
}) => (
  <Card className={`p-4 relative overflow-hidden transition-all hover:shadow-md ${
    label === 'All Scripts' ? 'border-2 border-primary' : ''
  }`}>
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <span className="text-3xl font-semibold">{count}</span>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
    <div className={`h-1 absolute bottom-0 left-0 right-0 ${color.replace('bg-', 'bg-opacity-20 bg-')}`} />
  </Card>
);

const LabScripts = () => {
  const [selectedScript, setSelectedScript] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: labScripts, isLoading } = useQuery({
    queryKey: ['admin-lab-scripts'],
    queryFn: async () => {
      console.log('Fetching lab scripts...');
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
      return data;
    }
  });

  const statusCounts = {
    new: labScripts?.filter(script => script.status === 'pending')?.length || 0,
    inProcess: labScripts?.filter(script => script.status === 'in_progress')?.length || 0,
    paused: labScripts?.filter(script => script.status === 'paused')?.length || 0,
    onHold: labScripts?.filter(script => script.status === 'on_hold')?.length || 0,
    incomplete: labScripts?.filter(script => script.status === 'incomplete')?.length || 0,
    completed: labScripts?.filter(script => script.status === 'completed')?.length || 0,
    all: labScripts?.length || 0,
  };

  const statusCards = [
    { icon: Clock, label: 'New Lab Scripts', count: statusCounts.new, color: 'bg-amber-500' },
    { icon: Loader2, label: 'In Process', count: statusCounts.inProcess, color: 'bg-blue-500' },
    { icon: Pause, label: 'Paused', count: statusCounts.paused, color: 'bg-orange-500' },
    { icon: StopCircle, label: 'On Hold', count: statusCounts.onHold, color: 'bg-red-500' },
    { icon: AlertTriangle, label: 'Incomplete', count: statusCounts.incomplete, color: 'bg-pink-500' },
    { icon: CheckCircle, label: 'Completed', count: statusCounts.completed, color: 'bg-green-500' },
    { icon: FileText, label: 'All Scripts', count: statusCounts.all, color: 'bg-violet-500' },
  ];

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('lab_scripts')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-lab-scripts'] });
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

  return (
    <AdminLayout>
      <div className="space-y-8 p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {statusCards.map((card) => (
            <StatusCard
              key={card.label}
              icon={card.icon}
              label={card.label}
              count={card.count}
              color={card.color}
            />
          ))}
        </div>

        <Card className="p-6">
          {isLoading ? (
            <LoadingLabScripts />
          ) : !labScripts?.length ? (
            <EmptyLabScripts />
          ) : (
            <LabScriptsTable
              labScripts={labScripts}
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
    </AdminLayout>
  );
};

export default LabScripts;