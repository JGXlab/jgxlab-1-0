import {
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ClinicsTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="text-foreground font-semibold">Clinic Name</TableHead>
        <TableHead className="text-foreground font-semibold">Doctor</TableHead>
        <TableHead className="text-foreground font-semibold">Contact Person</TableHead>
        <TableHead className="text-foreground font-semibold">Email</TableHead>
        <TableHead className="text-foreground font-semibold">Phone</TableHead>
        <TableHead className="text-foreground font-semibold">Address</TableHead>
        <TableHead className="text-foreground font-semibold">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}