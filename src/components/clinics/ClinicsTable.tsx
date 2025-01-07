import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { ClinicsTableHeader } from "./ClinicsTableHeader";
import { ClinicTableActions } from "./ClinicTableActions";
import { Clinic } from "./types";

export function ClinicsTable() {
  const { data: clinics, isLoading } = useQuery({
    queryKey: ['clinics'],
    queryFn: async () => {
      console.log('Fetching clinics...');
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clinics:', error);
        throw error;
      }

      console.log('Fetched clinics:', data);
      return data as Clinic[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted">Loading clinics...</div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <ClinicsTableHeader />
        <TableBody>
          {clinics?.map((clinic) => (
            <TableRow key={clinic.id}>
              <TableCell className="font-medium">{clinic.name}</TableCell>
              <TableCell>{clinic.doctor_name}</TableCell>
              <TableCell>{clinic.contact_person}</TableCell>
              <TableCell>{clinic.email}</TableCell>
              <TableCell>{clinic.phone}</TableCell>
              <TableCell>{clinic.address}</TableCell>
              <TableCell>
                <ClinicTableActions clinic={clinic} />
              </TableCell>
            </TableRow>
          ))}
          {!clinics?.length && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground h-24">
                No clinics found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}