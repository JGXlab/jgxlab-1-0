import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EditClinicDialog } from "./EditClinicDialog";
import { Clinic } from "./types";
import { KeyRound, Building2, Mail, Phone, User } from "lucide-react";

export function ClinicsTable() {
  const { toast } = useToast();
  
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

      const transformedData = data.map(clinic => ({
        ...clinic,
        street_address: '',
        city: '',
        state: '',
        zip_code: '',
      })) as Clinic[];

      console.log('Fetched clinics:', transformedData);
      return transformedData;
    },
  });

  const handlePasswordReset = async (userId: string, clinicName: string) => {
    try {
      console.log('Resetting password for:', userId);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No active session found');
      }

      const response = await fetch(
        'https://zuwhzwfdourrvrwhrajj.functions.supabase.co/reset-clinic-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      toast({
        title: "Password Reset Successfully",
        description: `Password has been reset for ${clinicName}`,
      });
      
    } catch (error) {
      console.error('Error in password reset handler:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted">Loading clinics...</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white border border-gray-200 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-none">
            <TableHead className="text-primary/80 font-semibold">
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span>Clinic Name</span>
              </div>
            </TableHead>
            <TableHead className="text-primary/80 font-semibold">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Doctor</span>
              </div>
            </TableHead>
            <TableHead className="text-primary/80 font-semibold">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Contact Person</span>
              </div>
            </TableHead>
            <TableHead className="text-primary/80 font-semibold">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </div>
            </TableHead>
            <TableHead className="text-primary/80 font-semibold">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Phone</span>
              </div>
            </TableHead>
            <TableHead className="text-primary/80 font-semibold">
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span>Address</span>
              </div>
            </TableHead>
            <TableHead className="text-right text-primary/80 font-semibold">
              <span>Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clinics?.map((clinic) => (
            <TableRow 
              key={clinic.id}
              className="hover:bg-gray-50/50 transition-colors duration-200"
            >
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{clinic.name}</p>
                    <p className="text-sm text-gray-600">ID: {clinic.id.slice(0, 8)}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-gray-600">{clinic.doctor_name}</TableCell>
              <TableCell className="text-gray-600">{clinic.contact_person}</TableCell>
              <TableCell className="text-gray-600">{clinic.email}</TableCell>
              <TableCell className="text-gray-600">{clinic.phone}</TableCell>
              <TableCell className="text-gray-600">{clinic.address}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <EditClinicDialog clinic={clinic} />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePasswordReset(clinic.auth_user_id, clinic.name)}
                    className="bg-white hover:bg-gray-50/50 text-primary hover:text-primary/90 border border-gray-200"
                  >
                    <KeyRound className="w-4 h-4 mr-2" />
                    Reset Password
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {!clinics?.length && (
            <TableRow>
              <TableCell 
                colSpan={7} 
                className="h-24 text-center text-gray-500"
              >
                No clinics found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}