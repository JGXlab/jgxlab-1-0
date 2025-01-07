import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Search, Users } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditPatientForm } from "@/components/patients/EditPatientForm";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { PatientActions } from "@/components/patients/PatientActions";
import { LabScriptHistoryModal } from "@/components/patients/LabScriptHistoryModal";
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

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPatient, setEditingPatient] = useState(null);
  const [deletingPatient, setDeletingPatient] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: patients, isLoading } = useQuery({
    queryKey: ['admin-patients'],
    queryFn: async () => {
      console.log('Fetching patients with clinic information...');
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          clinics (
            name,
            user_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching patients:', error);
        throw error;
      }

      console.log('Fetched patients:', data);
      return data;
    }
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

      queryClient.invalidateQueries({ queryKey: ['admin-patients'] });
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

  const filteredPatients = patients?.filter(patient => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 w-[300px] bg-white border-gray-200 focus-visible:ring-primary"
          />
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-sm bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-gray-500">Loading patients...</p>
          </div>
        ) : !filteredPatients?.length ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <Users className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-gray-500 font-medium">No patients found</p>
            <p className="text-sm text-gray-400">
              {searchQuery ? "Try adjusting your search terms" : "Add your first patient to get started"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                <TableHead className="text-primary/80 font-semibold">Name</TableHead>
                <TableHead className="text-primary/80 font-semibold">Gender</TableHead>
                <TableHead className="text-primary/80 font-semibold">Clinic</TableHead>
                <TableHead className="text-primary/80 font-semibold">Created At</TableHead>
                <TableHead className="text-primary/80 font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-gray-50/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {patient.first_name} {patient.last_name}
                        </span>
                        <span className="text-sm text-gray-500">
                          ID: {patient.id.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize bg-accent text-accent-foreground">
                      {patient.gender}
                    </Badge>
                  </TableCell>
                  <TableCell>{patient.clinics?.name || 'No clinic assigned'}</TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(patient.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <PatientActions
                      onEdit={() => setEditingPatient(patient)}
                      onDelete={() => setDeletingPatient(patient)}
                      onViewHistory={() => setSelectedPatient(patient)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

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

      {selectedPatient && (
        <LabScriptHistoryModal
          isOpen={!!selectedPatient}
          onClose={() => setSelectedPatient(null)}
          patientId={selectedPatient.id}
          patientName={`${selectedPatient.first_name} ${selectedPatient.last_name}`}
        />
      )}
    </AdminLayout>
  );
};

export default Patients;