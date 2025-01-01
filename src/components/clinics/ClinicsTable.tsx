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

      console.log('Fetched clinics:', data);
      return data as Clinic[];
    },
  });

  const handleInvite = async (email: string, clinicName: string) => {
    try {
      console.log('Creating user and sending invitation to:', email);
      
      // First, create the user with the default password
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password: 'password1',
        options: {
          data: {
            clinic_name: clinicName,
          },
        }
      });
      
      console.log('User creation response:', { signUpData, signUpError });
      
      if (signUpError) {
        console.error('Error creating user:', signUpError);
        toast({
          variant: "destructive",
          title: "Error Creating User",
          description: `Failed to create user: ${signUpError.message}`,
        });
        return;
      }

      // Then send a magic link for password reset
      const { data: resetData, error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/admin/login`,
        }
      );

      console.log('Password reset email response:', { resetData, resetError });

      if (resetError) {
        console.error('Error sending reset email:', resetError);
        toast({
          variant: "destructive",
          title: "Error Sending Reset Email",
          description: `Failed to send reset email: ${resetError.message}`,
        });
        return;
      }

      toast({
        title: "User Created and Invited",
        description: `An account has been created for ${email} and a password reset link has been sent. Please check spam folder if not received.`,
      });
    } catch (error) {
      console.error('Unexpected error in invite handler:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-foreground font-semibold">Clinic Name</TableHead>
            <TableHead className="text-foreground font-semibold">Doctor</TableHead>
            <TableHead className="text-foreground font-semibold">Contact Person</TableHead>
            <TableHead className="text-foreground font-semibold">Email</TableHead>
            <TableHead className="text-foreground font-semibold">Phone</TableHead>
            <TableHead className="text-foreground font-semibold">Address</TableHead>
            <TableHead className="text-foreground font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clinics?.map((clinic) => (
            <TableRow key={clinic.id}>
              <TableCell className="font-medium">{clinic.name}</TableCell>
              <TableCell>{clinic.doctor_name}</TableCell>
              <TableCell>{clinic.contact_person}</TableCell>
              <TableCell>{clinic.email}</TableCell>
              <TableCell>{clinic.phone}</TableCell>
              <TableCell>{clinic.address}</TableCell>
              <TableCell className="flex items-center">
                <EditClinicDialog clinic={clinic} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleInvite(clinic.email, clinic.name)}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {!clinics?.length && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground h-24">
                No clinics found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}