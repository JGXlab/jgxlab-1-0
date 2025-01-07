import { Table, TableBody } from "@/components/ui/table";
import { LabScriptsTableHeader } from "./TableHeader";
import { TableRowContent } from "./TableRowContent";
import { LoadingLabScripts } from "./LoadingLabScripts";
import { EmptyLabScripts } from "./EmptyLabScripts";

interface LabScriptsTableProps {
  labScripts: any[];
  isLoading?: boolean;
  onPreview: (script: any, e: React.MouseEvent) => void;
  onStatusUpdate?: (id: string, status: string, reason?: string, comment?: string) => void;
  isDesignPortal?: boolean;
  hideClinicColumn?: boolean;
}

export const LabScriptsTable = ({ 
  labScripts, 
  isLoading, 
  onPreview, 
  onStatusUpdate,
  isDesignPortal = false,
  hideClinicColumn = false
}: LabScriptsTableProps) => {
  if (isLoading) {
    return <LoadingLabScripts />;
  }

  if (!labScripts?.length) {
    return <EmptyLabScripts />;
  }

  return (
    <Table>
      <LabScriptsTableHeader 
        isDesignPortal={isDesignPortal} 
        hideClinicColumn={hideClinicColumn} 
      />
      <TableBody>
        {labScripts.map((script) => (
          <TableRowContent 
            key={script.id} 
            script={script} 
            onPreview={onPreview}
            onStatusUpdate={onStatusUpdate}
            isDesignPortal={isDesignPortal}
            hideClinicColumn={hideClinicColumn}
          />
        ))}
      </TableBody>
    </Table>
  );
};