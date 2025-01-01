"use client";

import { useState } from "react";
import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatePatientForm } from "@/components/patients/CreatePatientForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PatientsTable } from "@/components/patients/PatientsTable";
import { useToast } from "@/hooks/use-toast";

export default function ClinicPatients() {
  const [createOpen, setCreateOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get the clinic data for the logged-in user
  const { data: clinicData, isLoading: isLoadingClinic } = useQuery({
    queryKey: ['clinic'],
    queryFn: async () => {
      console.log('Fetching clinic data...');
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching clinic:', error);
        throw error;
      }

      console.log('Fetched clinic data:', data);
      return data;
    }
  });

  return (
    <ClinicLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Patients</h1>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2" />
                Add New Patient
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>
                  Create a new patient record in your clinic.
                </DialogDescription>
              </DialogHeader>
              <CreatePatientForm 
                onSuccess={() => setCreateOpen(false)} 
                clinicId={clinicData?.id}
              />
            </DialogContent>
          </Dialog>
        </div>

        {isLoadingClinic ? (
          <div className="text-center py-4">Loading clinic data...</div>
        ) : (
          <PatientsTable clinicId={clinicData?.id} />
        )}
      </div>
    </ClinicLayout>
  );
}