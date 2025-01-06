import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface LoginAsClinicButtonProps {
  email: string;
  clinicName: string;
}

export function LoginAsClinicButton({ email, clinicName }: LoginAsClinicButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLoginAs = async () => {
    try {
      setIsLoading(true);
      console.log('Attempting admin login as clinic:', email);
      
      // First, get the current admin session
      const { data: { session: adminSession } } = await supabase.auth.getSession();
      
      if (!adminSession) {
        throw new Error("Admin session not found");
      }

      // Store admin access token for later
      const adminAccessToken = adminSession.access_token;

      // Sign in as the clinic user using admin access
      const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'Password1', // Try default password first
      });

      if (signInError) {
        console.error('Error in initial login attempt:', signInError);
        
        // If default password fails, create a temporary password and reset it
        const tempPassword = Math.random().toString(36).slice(-8);
        
        // Update user's password using admin token
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          user?.id || '',
          { password: tempPassword }
        );

        if (updateError) {
          throw updateError;
        }

        // Try logging in with temporary password
        const { error: secondSignInError } = await supabase.auth.signInWithPassword({
          email: email,
          password: tempPassword,
        });

        if (secondSignInError) {
          throw secondSignInError;
        }
      }

      // Redirect to clinic dashboard
      navigate('/clinic/dashboard');

      toast({
        title: "Logged In As Clinic",
        description: `Successfully logged in as ${clinicName}`,
      });
    } catch (error) {
      console.error('Error in login as handler:', error);
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Unable to login as clinic. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLoginAs}
      disabled={isLoading}
    >
      <LogIn className="w-4 h-4 mr-2" />
      {isLoading ? "Logging in..." : "Login As"}
    </Button>
  );
}