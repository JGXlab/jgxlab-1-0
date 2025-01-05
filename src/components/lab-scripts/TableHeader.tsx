import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface LabScriptsTableHeaderProps {
  isDesignPortal?: boolean;
  hideClinicColumn?: boolean;
}

export const LabScriptsTableHeader = ({ 
  isDesignPortal = false,
  hideClinicColumn = false 
}: LabScriptsTableHeaderProps) => {
  if (isDesignPortal) {
    return (
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Patient</TableHead>
          {!hideClinicColumn && <TableHead className="w-[200px]">Clinic</TableHead>}
          <TableHead className="w-[200px]">Appliance</TableHead>
          <TableHead className="w-[150px]">Due Date</TableHead>
        </TableRow>
      </TableHeader>
    );
  }

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[200px]">Patient</TableHead>
        <TableHead className="w-[200px]">Clinic</TableHead>
        <TableHead className="w-[200px]">Appliance</TableHead>
        <TableHead className="w-[150px]">Due Date</TableHead>
      </TableRow>
    </TableHeader>
  );
};
