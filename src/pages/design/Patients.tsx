import { DesignLayout } from "@/components/design/DesignLayout";
import { DesignNavbar } from "@/components/design/DesignNavbar";
import { Card } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditPatientForm } from "@/components/patients/EditPatientForm";
import { useToast } from "@/hooks/use-toast";
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
import { PatientSearchBar } from "@/components/patients/PatientSearchBar";
import { PatientsAdminTable } from "@/components/patients/PatientsAdminTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPatient, setEditingPatient] = useState(null);
  const [deletingPatient, setDeletingPatient] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: patients, isLoading } = useQuery({
    queryKey: ['designer-patients'],
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

      queryClient.invalidateQueries({ queryKey: ['designer-patients'] });
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
    <DesignLayout>
      <DesignNavbar />
      <div className="min-h-screen w-full px-8 md:px-12 lg:px-16 py-8 bg-gradient-to-br from-[#F1F0FB] to-[#E5DEFF]">
        <div className="max-w-[1600px] mx-auto space-y-6">
          <div className="flex flex-col space-y-1.5">
            <h2 className="text-2xl font-semibold text-[#1A1F2C]">Patients</h2>
            <p className="text-[#8A898C]">Manage and view all patient records</p>
          </div>

          <div className="flex justify-between items-center gap-4">
            <PatientSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
            />
            <Button 
              className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white font-medium px-4 py-2 rounded-full flex items-center gap-2 transition-colors duration-200"
              onClick={() => setEditingPatient({})}
            >
              <Plus className="h-4 w-4" />
              Add New Patient
            </Button>
          </div>

          <Card className="overflow-hidden border-none shadow-sm bg-white/80 backdrop-blur-sm rounded-xl">
            {isLoading ? (
              <div className="flex items-center justify-center h-40">
                <p className="text-[#8A898C]">Loading patients...</p>
              </div>
            ) : (
              <PatientsAdminTable
                patients={filteredPatients || []}
                onEdit={setEditingPatient}
                onDelete={setDeletingPatient}
                onViewHistory={setSelectedPatient}
              />
            )}
          </Card>

          <Dialog open={!!editingPatient} onOpenChange={(open) => !open && setEditingPatient(null)}>
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle className="text-[#1A1F2C]">
                  {editingPatient?.id ? 'Edit Patient' : 'Add New Patient'}
                </DialogTitle>
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
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[#1A1F2C]">Are you sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-[#8A898C]">
                  This action cannot be undone. This will permanently delete the patient
                  {deletingPatient && ` ${deletingPatient.first_name} ${deletingPatient.last_name}`}
                  and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-[#F6F6F7] text-[#403E43] hover:bg-[#E5DEFF] hover:text-[#6E59A5]">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeletePatient}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
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
        </div>
      </div>
    </DesignLayout>
  );
};

export default Patients;