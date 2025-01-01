import { useState } from "react";
import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatePatientForm } from "@/components/patients/CreatePatientForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ClinicPatients() {
  const [open, setOpen] = useState(false);

  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      console.log('Fetching patients...');
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching patients:', error);
        throw error;
      }

      console.log('Fetched patients:', data);
      return data;
    }
  });

  return (
    <ClinicLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Patients</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2" />
                Add New Patient
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
              </DialogHeader>
              <CreatePatientForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-4">Loading patients...</div>
        ) : patients && patients.length > 0 ? (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      {patient.first_name} {patient.last_name}
                    </TableCell>
                    <TableCell className="capitalize">{patient.gender}</TableCell>
                    <TableCell>
                      {new Date(patient.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No patients found. Add your first patient to get started.
          </div>
        )}
      </div>
    </ClinicLayout>
  );
}