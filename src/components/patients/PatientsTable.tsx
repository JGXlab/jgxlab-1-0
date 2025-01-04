import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { EditPatientForm } from "./EditPatientForm";
import { useToast } from "@/hooks/use-toast";

interface PatientsTableProps {
  clinicId?: string;
}

export function PatientsTable({ clinicId }: PatientsTableProps) {
  const [editingPatient, setEditingPatient] = useState(null);
  const [deletingPatient, setDeletingPatient] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients', clinicId],
    queryFn: async () => {
      console.log('Fetching patients for clinic:', clinicId);
      const query = supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (clinicId) {
        query.eq('clinic_id', clinicId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching patients:', error);
        throw error;
      }

      console.log('Fetched patients:', data);
      return data;
    },
    enabled: !!clinicId
  });

  const handleDeletePatient = async () => {
    if (!deletingPatient) return;

    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', deletingPatient.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Patient deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['patients'] });
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast({
        title: "Error",
        description: "Failed to delete patient",
        variant: "destructive",
      });
    } finally {
      setDeletingPatient(null);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Loading patients...</div>;
  }

  return (
    <>
      <div className="rounded-xl bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
              <TableHead className="text-gray-600 font-medium">Name</TableHead>
              <TableHead className="text-gray-600 font-medium">Gender</TableHead>
              <TableHead className="text-gray-600 font-medium">Date of Birth</TableHead>
              <TableHead className="text-gray-600 font-medium">Created At</TableHead>
              <TableHead className="text-gray-600 font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients && patients.length > 0 ? (
              patients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium">
                    {patient.first_name} {patient.last_name}
                  </TableCell>
                  <TableCell className="capitalize">{patient.gender}</TableCell>
                  <TableCell>
                    {patient.date_of_birth ? new Date(patient.date_of_birth).toLocaleDateString() : 'Not set'}
                  </TableCell>
                  <TableCell>
                    {new Date(patient.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPatient(patient)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingPatient(patient)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No patients found. Add your first patient to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingPatient} onOpenChange={(open) => !open && setEditingPatient(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
          </DialogHeader>
          {editingPatient && (
            <EditPatientForm
              patient={editingPatient}
              onSuccess={() => setEditingPatient(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingPatient} onOpenChange={(open) => !open && setDeletingPatient(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the patient
              {deletingPatient && ` ${deletingPatient.first_name} ${deletingPatient.last_name}`}
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePatient} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}