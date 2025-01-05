import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

interface DashboardLabScriptsTableProps {
  labScripts: any[];
  isLoading?: boolean;
}

export const DashboardLabScriptsTable = ({ labScripts, isLoading }: DashboardLabScriptsTableProps) => {
  if (isLoading) {
    return <div className="flex items-center justify-center p-4">Loading...</div>;
  }

  return (
    <ScrollArea className="h-[500px]">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
            <TableHead className="text-primary/80 font-medium">Patient</TableHead>
            <TableHead className="text-primary/80 font-medium">Clinic</TableHead>
            <TableHead className="text-primary/80 font-medium">Appliance</TableHead>
            <TableHead className="text-primary/80 font-medium">Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {labScripts.map((script) => (
            <TableRow 
              key={script.id}
              className="hover:bg-gray-50/50 cursor-pointer transition-colors"
            >
              <TableCell className="font-medium">
                {script.patients?.first_name} {script.patients?.last_name}
              </TableCell>
              <TableCell>{script.patients?.clinics?.name}</TableCell>
              <TableCell>{script.appliance_type.split('-').map((word: string) => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}</TableCell>
              <TableCell>{format(new Date(script.due_date), 'MMM d, yyyy')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};