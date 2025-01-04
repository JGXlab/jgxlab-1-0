"use client";

import { useState } from "react";
import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search, Bell } from "lucide-react";
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
import { Card } from "@/components/ui/card";

export default function ClinicPatients() {
  const [createOpen, setCreateOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
            <p className="text-sm text-gray-500">Manage your patient records and information</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search patients..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#0052FF] hover:bg-[#0040CC] text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
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
        </div>

        <div className="flex gap-4 mb-6">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#EEF2FF] text-[#0052FF] rounded-lg">
            <span className="w-2 h-2 bg-[#0052FF] rounded-full"></span>
            All Patients
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            Active
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            Inactive
          </button>
        </div>

        <Card className="rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {isLoadingClinic ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-gray-500">Loading clinic data...</p>
            </div>
          ) : (
            <PatientsTable clinicId={clinicData?.id} />
          )}
        </Card>
      </div>
    </ClinicLayout>
  );
}