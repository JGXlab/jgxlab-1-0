import { TableCell } from "@/components/ui/table";

interface ApplianceCellProps {
  applianceType: string;
  arch: string;
}

export const ApplianceCell = ({ applianceType, arch }: ApplianceCellProps) => {
  return (
    <TableCell>
      <div className="space-y-1">
        <p className="font-medium text-gray-900">
          {applianceType.split('-').map((word: string) => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </p>
        <p className="text-sm text-gray-600">
          {arch.charAt(0).toUpperCase() + arch.slice(1)} Arch
        </p>
      </div>
    </TableCell>
  );
};