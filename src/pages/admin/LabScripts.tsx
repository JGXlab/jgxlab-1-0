import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Search, Clock, Loader2, Pause, StopCircle, AlertTriangle, CheckCircle, FileText } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingLabScripts } from "@/components/lab-scripts/LoadingLabScripts";
import { EmptyLabScripts } from "@/components/lab-scripts/EmptyLabScripts";
import { PreviewLabScriptModal } from "@/components/surgical-form/PreviewLabScriptModal";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LabScriptsTable } from "@/components/lab-scripts/LabScriptsTable";

const StatusCard = ({ icon: Icon, label, count, color, gradient }: { 
  icon: any; 
  label: string; 
  count: number;
  color: string;
  gradient: string;
}) => (
  <Card className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
    label === 'All Scripts' ? 'border-2 border-primary' : ''
  }`}>
    <div className={`absolute inset-0 opacity-10 transition-opacity duration-300 group-hover:opacity-20 ${gradient}`} />
    <div className="p-4 relative z-10">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-bold tracking-tight animate-fade-in">{count}</span>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </div>
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
    { 
      icon: Clock, 
      label: 'New Lab Scripts', 
      count: statusCounts.new, 
      color: 'bg-amber-500',
      gradient: 'bg-gradient-to-br from-amber-500/20 to-orange-500/20'
    },
    { 
      icon: Loader2, 
      label: 'In Process', 
      count: statusCounts.inProcess, 
      color: 'bg-blue-500',
      gradient: 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20'
    },
    { 
      icon: Pause, 
      label: 'Paused', 
      count: statusCounts.paused, 
      color: 'bg-orange-500',
      gradient: 'bg-gradient-to-br from-orange-500/20 to-red-500/20'
    },
    { 
      icon: StopCircle, 
      label: 'On Hold', 
      count: statusCounts.onHold, 
      color: 'bg-red-500',
      gradient: 'bg-gradient-to-br from-red-500/20 to-pink-500/20'
    },
    { 
      icon: AlertTriangle, 
      label: 'Incomplete', 
      count: statusCounts.incomplete, 
      color: 'bg-pink-500',
      gradient: 'bg-gradient-to-br from-pink-500/20 to-rose-500/20'
    },
    { 
      icon: CheckCircle, 
      label: 'Completed', 
      count: statusCounts.completed, 
      color: 'bg-green-500',
      gradient: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20'
    },
    { 
      icon: FileText, 
      label: 'All Scripts', 
      count: statusCounts.all, 
      color: 'bg-violet-500',
      gradient: 'bg-gradient-to-br from-violet-500/20 to-purple-500/20'
    },
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
      <div className="space-y-8 p-8 animate-fade-in">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {statusCards.map((card) => (
            <StatusCard
              key={card.label}
              icon={card.icon}
              label={card.label}
              count={card.count}
              color={card.color}
              gradient={card.gradient}
            />
          ))}
        </div>

        <Card className="p-6 backdrop-blur-sm bg-white/50 shadow-lg">
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