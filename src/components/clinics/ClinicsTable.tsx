import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  
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
      console.log('Sending invitation to:', email);
      
      // First, check if the user already exists
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
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo: `${window.location.origin}/clinic/login`,
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
        const tempPassword = 'Password1'; // Temporary password for initial login
        
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password: tempPassword,
          options: {
            data: {
              clinic_name: clinicName,
              role: 'clinic',
            },
          }
        });

        if (signUpError) {
          console.error('Error creating user:', signUpError);
          throw signUpError;
        }

        if (signUpData.user) {
          // Send password reset email to new user
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(
            email,
            {
              redirectTo: `${window.location.origin}/clinic/login`,
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

  const handleLoginAsClinic = async (clinicId: string, email: string) => {
    try {
      console.log('Attempting to login as clinic:', email);
      
      // First check if the user exists in profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('email', email)
        .maybeSingle();

      if (profileError || !profileData) {
        console.error('Error checking profile or profile not found:', profileError);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Could not find clinic profile. Please make sure the clinic has been invited first.",
        });
        return;
      }

      // Sign out of current admin session
      await supabase.auth.signOut();
      
      // Sign in as the clinic user with default password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: 'Password1',
      });

      if (error) {
        console.error('Error logging in as clinic:', error);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Could not login as clinic. The clinic may need to be invited first or reset their password.",
        });
        return;
      }

      if (data.user) {
        toast({
          title: "Success",
          description: `Logged in as clinic: ${email}`,
        });
        navigate("/clinic/dashboard");
      }
    } catch (error) {
      console.error('Error in login as clinic handler:', error);
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
              <TableCell className="flex items-center gap-2">
                <EditClinicDialog clinic={clinic} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleInvite(clinic.email, clinic.name)}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLoginAsClinic(clinic.id, clinic.email)}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login as
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