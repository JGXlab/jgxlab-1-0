import { Table, TableBody, TableHead } from "@/components/ui/table";
import { TableHeader } from "./TableHeader";
import { TableRowContent } from "./TableRowContent";
import { LoadingLabScripts } from "./LoadingLabScripts";
import { EmptyLabScripts } from "./EmptyLabScripts";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface LabScriptsTableProps {
  labScripts: any[];
  isLoading?: boolean;
  onPreview: (script: any, e: React.MouseEvent) => void;
}

export const LabScriptsTable = ({ labScripts, isLoading, onPreview }: LabScriptsTableProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleStatusUpdate = async (id: string, status: string) => {
    console.log('Updating status:', { id, status });
    try {
      const { error } = await supabase
        .from('lab_scripts')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['design-lab-scripts'] });
      
      toast({
        title: "Status Updated",
        description: `Lab script status updated to ${status}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <LoadingLabScripts />;
  }

  if (!labScripts.length) {
    return <EmptyLabScripts />;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHead>
          <TableHeader />
        </TableHead>
        <TableBody>
          {labScripts.map((script) => (
            <TableRowContent
              key={script.id}
              script={script}
              onPreview={onPreview}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};