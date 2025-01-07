import { Button } from "@/components/ui/button";
import { UserPlus, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { EditClinicDialog } from "./EditClinicDialog";
import { Clinic } from "./types";

interface ClinicTableActionsProps {
  clinic: Clinic;
}

export function ClinicTableActions({ clinic }: ClinicTableActionsProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInvite = async (email: string, clinicName: string) => {
    try {
      console.log('Sending invitation to:', email);
      
      // First, check if the user already exists in auth
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserByEmail(email);
      
      if (authError) {
        console.error('Error checking auth user:', authError);
        throw authError;
      }

      if (authUser) {
        console.log('User exists, sending password reset email');
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
          description: `A password reset link has been sent to ${email}`,
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
          if (signUpError.message.includes('already registered')) {
            // User exists but wasn't found by getUserByEmail, send reset email
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(
              email,
              {
                redirectTo: `${window.location.origin}/clinic/login`,
              }
            );

            if (resetError) throw resetError;

            toast({
              title: "Invitation Sent",
              description: `A password reset link has been sent to ${email}`,
            });
            return;
          }
          throw signUpError;
        }

        if (signUpData.user) {
          toast({
            title: "User Created",
            description: `Account created for ${email}. A confirmation email has been sent.`,
          });
        }
      }
    } catch (error) {
      console.error('Error in invite handler:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    }
  };

  const handleLoginAsClinic = async (clinicId: string, email: string) => {
    try {
      console.log('Attempting to login as clinic:', email);
      
      // First check if the user exists in auth
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserByEmail(email);

      if (authError || !authUser) {
        console.error('Error checking auth user or user not found:', authError);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Could not find clinic user. Please make sure the clinic has been invited first.",
        });
        return;
      }

      // Sign out of current admin session
      await supabase.auth.signOut();
      
      // Sign in as the clinic user
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: 'Password1',
      });

      if (error) {
        console.error('Error logging in as clinic:', error);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Could not login as clinic. The clinic may need to reset their password.",
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

  return (
    <div className="flex items-center gap-2">
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
    </div>
  );
}