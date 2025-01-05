"use client";

import { useState } from "react";
import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClinicNavHeader } from "@/components/clinic/ClinicNavHeader";

export default function ClinicPatients() {
  const [createOpen, setCreateOpen] = useState(false);
  const { toast } = useToast();

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
      <div className="flex flex-col max-w-[1200px] w-full mx-auto h-screen py-8">
        <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
          <ClinicNavHeader />
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-6">
              <div className="flex justify-end items-center">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 w-64 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-primary/90 text-white">
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

              <Card className="bg-gradient-to-br from-white to-accent/30 border-none shadow-lg overflow-hidden">
                {isLoadingClinic ? (
                  <div className="flex items-center justify-center h-40">
                    <p className="text-gray-500">Loading clinic data...</p>
                  </div>
                ) : (
                  <PatientsTable clinicId={clinicData?.id} />
                )}
              </Card>
            </div>
          </div>
        </ScrollArea>
      </div>
    </ClinicLayout>
  );
}