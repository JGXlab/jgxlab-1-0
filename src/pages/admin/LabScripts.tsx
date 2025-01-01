import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Bell, Eye, Play, Pause, StopCircle, Loader } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingLabScripts } from "@/components/lab-scripts/LoadingLabScripts";
import { EmptyLabScripts } from "@/components/lab-scripts/EmptyLabScripts";
import { format } from "date-fns";
import { PreviewLabScriptModal } from "@/components/surgical-form/PreviewLabScriptModal";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-orange-100 text-orange-800';
      case 'on_hold':
        return 'bg-purple-100 text-purple-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusUpdate = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, newStatus });
  };

  const handlePreview = (script: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedScript(script);
    setIsPreviewOpen(true);
  };

  const renderStatusButtons = (script: any) => {
    const status = script.status.toLowerCase();

    if (status === 'completed') {
      return (
        <Badge className="bg-green-100 text-green-800">
          Design Completed
        </Badge>
      );
    }

    if (status === 'paused' || status === 'on_hold') {
      return (
        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => handleStatusUpdate(script.id, 'in_progress')}
        >
          <Play className="h-4 w-4" />
          Resume
        </Button>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => handleStatusUpdate(script.id, 'paused')}
        >
          <Pause className="h-4 w-4" />
          Pause
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => handleStatusUpdate(script.id, 'on_hold')}
        >
          <Loader className="h-4 w-4" />
          Hold
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => handleStatusUpdate(script.id, 'completed')}
        >
          <StopCircle className="h-4 w-4" />
          Complete
        </Button>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Lab Scripts</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search lab scripts..."
              className="pl-10 pr-4 w-64"
            />
          </div>
          <button className="p-2 relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <Button variant="outline" className="bg-primary/5 text-primary hover:bg-primary/10">
          All Scripts
        </Button>
        <Button variant="ghost">Pending</Button>
        <Button variant="ghost">Completed</Button>
      </div>

      <Card className="p-6">
        {isLoading ? (
          <LoadingLabScripts />
        ) : !labScripts?.length ? (
          <EmptyLabScripts />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Treatment Type</TableHead>
                <TableHead>Appliance Type</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>Status Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {labScripts.map((script) => (
                <TableRow key={script.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {script.patients?.first_name} {script.patients?.last_name}
                  </TableCell>
                  <TableCell>{script.treatment_type}</TableCell>
                  <TableCell>{script.appliance_type}</TableCell>
                  <TableCell>{script.due_date}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(script.status)}>
                      {script.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {format(new Date(script.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full flex items-center justify-center gap-2"
                      onClick={(e) => handlePreview(script, e)}
                    >
                      <Eye className="h-4 w-4" />
                      <span>Preview</span>
                    </Button>
                  </TableCell>
                  <TableCell>
                    {renderStatusButtons(script)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
    </AdminLayout>
  );
};

export default LabScripts;