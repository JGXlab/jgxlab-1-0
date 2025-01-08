import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus } from "lucide-react";
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

      // Transform the data to include address fields
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

  const handleInvite = async (email: string, clinicName: string) => {
    try {
      console.log('Sending invitation to:', email);
      
      // First, check if the user already exists using maybeSingle() instead of single()
      const { data: existingUser, error: userCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (userCheckError) {
        console.error('Error checking existing user:', userCheckError);
        throw userCheckError;
      }

      if (existingUser) {
        console.log('User already exists, sending password reset email');
        // If user exists, just send a password reset email
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo: `${window.location.origin}/admin/login`,
          }
        );

        if (resetError) {
          console.error('Error sending reset email:', resetError);
          throw resetError;
        }

        toast({
          title: "Invitation Sent",
          description: `A password reset link has been sent to ${email}. Please check spam folder if not received.`,
        });
      } else {
        console.log('Creating new user and sending invitation');
        // If user doesn't exist, create them and send invitation
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password: 'Password1',
          options: {
            data: {
              clinic_name: clinicName,
            },
          }
        });

        if (signUpError) {
          console.error('Error creating user:', signUpError);
          throw signUpError;
        }

        // Send password reset email to new user
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo: `${window.location.origin}/admin/login`,
          }
        );

        if (resetError) {
          console.error('Error sending reset email:', resetError);
          throw resetError;
        }

        toast({
          title: "User Created and Invited",
          description: `An account has been created for ${email} and a password reset link has been sent. Please check spam folder if not received.`,
        });
      }
    } catch (error) {
      console.error('Error in invite handler:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
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