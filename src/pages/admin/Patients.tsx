import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Bell, Search, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Patients = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
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

  const filteredPatients = patients?.filter(patient => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
          <p className="text-sm text-muted-foreground">
            Manage and view all patient records across clinics
          </p>
        </div>
        <div className="flex items-center gap-4">
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
          <Button variant="outline" size="icon" className="relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <Button
          variant="secondary"
          className="bg-primary/10 hover:bg-primary/20 text-primary"
        >
          <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
          All Patients
        </Button>
        <Button variant="ghost" className="text-gray-600">
          Active
        </Button>
        <Button variant="ghost" className="text-gray-600">
          Inactive
        </Button>
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
                  <TableCell className="capitalize text-gray-600">{patient.gender}</TableCell>
                  <TableCell>{patient.clinics?.name || 'No clinic assigned'}</TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(patient.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </AdminLayout>
  );
};

export default Patients;