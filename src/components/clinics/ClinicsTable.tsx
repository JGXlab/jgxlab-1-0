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
import { KeyRound } from "lucide-react";

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
      
      // Get the current session
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
    <div className="rounded-xl border border-[#D3E4FD] bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-[#D3E4FD] hover:bg-[#F8FAFC]">
            <TableHead className="text-sm font-semibold text-[#1A1F2C]">Clinic Name</TableHead>
            <TableHead className="text-sm font-semibold text-[#1A1F2C]">Doctor</TableHead>
            <TableHead className="text-sm font-semibold text-[#1A1F2C]">Contact Person</TableHead>
            <TableHead className="text-sm font-semibold text-[#1A1F2C]">Email</TableHead>
            <TableHead className="text-sm font-semibold text-[#1A1F2C]">Phone</TableHead>
            <TableHead className="text-sm font-semibold text-[#1A1F2C]">Address</TableHead>
            <TableHead className="text-sm font-semibold text-[#1A1F2C]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clinics?.map((clinic) => (
            <TableRow 
              key={clinic.id}
              className="border-b border-[#D3E4FD] hover:bg-[#F8FAFC] transition-colors"
            >
              <TableCell className="font-medium text-[#403E43]">{clinic.name}</TableCell>
              <TableCell className="text-[#8E9196]">{clinic.doctor_name}</TableCell>
              <TableCell className="text-[#8E9196]">{clinic.contact_person}</TableCell>
              <TableCell className="text-[#8E9196]">{clinic.email}</TableCell>
              <TableCell className="text-[#8E9196]">{clinic.phone}</TableCell>
              <TableCell className="text-[#8E9196]">{clinic.address}</TableCell>
              <TableCell className="flex items-center gap-2">
                <EditClinicDialog clinic={clinic} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePasswordReset(clinic.auth_user_id, clinic.name)}
                  className="bg-white border-[#D3E4FD] text-primary hover:bg-[#F8FAFC] hover:text-primary/90 transition-colors"
                >
                  <KeyRound className="w-4 h-4 mr-2" />
                  Reset Password
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {!clinics?.length && (
            <TableRow>
              <TableCell 
                colSpan={7} 
                className="h-24 text-center text-[#8E9196]"
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