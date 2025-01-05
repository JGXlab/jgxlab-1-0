import { Table, TableBody } from "@/components/ui/table";
import { LabScriptsTableHeader } from "./TableHeader";
import { TableRowContent } from "./TableRowContent";
import { EmptyLabScripts } from "./EmptyLabScripts";
import { LoadingLabScripts } from "./LoadingLabScripts";
import { Users } from "lucide-react";

interface LabScriptsTableProps {
  labScripts: any[];
  isLoading: boolean;
  onPreview: (script: any, e: React.MouseEvent) => void;
  onStatusUpdate?: (id: string, status: string) => void;
}

export function LabScriptsTable({ 
  labScripts, 
  isLoading, 
  onPreview,
  onStatusUpdate 
}: LabScriptsTableProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-gray-500">Loading lab scripts...</p>
      </div>
    );
  }

  if (!labScripts?.length) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400">
        <div className="text-center">
          <Users className="w-12 h-12 mx-auto mb-4" />
          <p>No lab scripts found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white">
      <Table>
        <LabScriptsTableHeader />
        <TableBody>
          {labScripts.map((script) => (
            <TableRowContent 
              key={script.id} 
              script={script} 
              onPreview={onPreview}
              onStatusUpdate={onStatusUpdate}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}