import { ClinicSidebar } from "@/components/clinic/ClinicSidebar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserPlus } from "lucide-react";
import { CreatePatientForm } from "@/components/patients/CreatePatientForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PatientsPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setIsDetailsDialogOpen(true);
  };

  return (
    <div className="flex h-screen w-full">
      <ClinicSidebar />
      <div className="flex-1 bg-gray-50">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Patients</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary-hover">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add New Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-semibold text-gray-900">
                    Add New Patient
                  </DialogTitle>
                </DialogHeader>
                <CreatePatientForm onSuccess={() => setIsDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-lg border bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      Loading patients...
                    </TableCell>
                  </TableRow>
                ) : patients?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No patients found. Add your first patient!
                    </TableCell>
                  </TableRow>
                ) : (
                  patients?.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">
                        {patient.first_name} {patient.last_name}
                      </TableCell>
                      <TableCell className="capitalize">{patient.gender}</TableCell>
                      <TableCell>
                        {new Date(patient.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary/20 hover:bg-primary/5"
                          onClick={() => handleViewDetails(patient)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Patient Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-gray-900">
              Patient Details
            </DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  {selectedPatient.first_name} {selectedPatient.last_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="capitalize">{selectedPatient.gender}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Created At</p>
                  <p>{new Date(selectedPatient.created_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientsPage;