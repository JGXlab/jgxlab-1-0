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
      
      // Check if user exists by attempting to get their profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error checking profile:', profileError);
        throw profileError;
      }

      if (profile) {
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
          title: "Password Reset Link Sent",
          description: `A password reset link has been sent to ${email}. The clinic must reset their password before logging in.`,
        });
      } else {
        console.log('Creating new user and sending invitation');
        const tempPassword = Math.random().toString(36).slice(-12) + 'A1!'; // Generate a secure random password
        
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
            // User exists but wasn't found in profiles, send reset email
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(
              email,
              {
                redirectTo: `${window.location.origin}/clinic/login`,
              }
            );

            if (resetError) throw resetError;

            toast({
              title: "Password Reset Link Sent",
              description: `A password reset link has been sent to ${email}. The clinic must reset their password before logging in.`,
            });
            return;
          }
          throw signUpError;
        }

        if (signUpData.user) {
          // Send password reset email immediately after signup
          const { error: resetError } = await supabase.auth.resetPasswordForEmail(
            email,
            {
              redirectTo: `${window.location.origin}/clinic/login`,
            }
          );

          if (resetError) throw resetError;

          toast({
            title: "Clinic Invited",
            description: `Account created for ${email}. A password setup link has been sent.`,
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
      
      // Check if user exists and has completed setup
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (profileError) {
        console.error('Error checking profile:', profileError);
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Could not find clinic user. Please make sure the clinic has been invited first.",
        });
        return;
      }

      if (!profile) {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Clinic user not found. Please invite the clinic first.",
        });
        return;
      }

      // First ensure we're signed out
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error('Error signing out:', signOutError);
        // Continue anyway as the session might not exist
      }
      
      toast({
        title: "Notice",
        description: "Please ask the clinic to set up their password using the link sent to their email before attempting to log in.",
      });

      navigate("/clinic/login");
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