import { Table, TableBody } from "@/components/ui/table";
import { LabScriptsTableHeader } from "./TableHeader";
import { TableRowContent } from "./TableRowContent";
import { EmptyLabScripts } from "./EmptyLabScripts";
import { LoadingLabScripts } from "./LoadingLabScripts";

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
      <Table>
        <LabScriptsTableHeader />
        <TableBody>
          <LoadingLabScripts />
        </TableBody>
      </Table>
    );
  }

  if (!labScripts?.length) {
    return (
      <Table>
        <LabScriptsTableHeader />
        <TableBody>
          <EmptyLabScripts />
        </TableBody>
      </Table>
    );
  }

  return (
    <Table>
      <LabScriptsTableHeader />
      <TableBody>
        {labScripts.map((script) => (
          <TableRowContent 
            key={script.id} 
            script={script} 
            onPreview={onPreview} 
          />
        ))}
      </TableBody>
    </Table>
  );
}