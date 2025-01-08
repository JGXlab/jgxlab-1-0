import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ClinicActionsProps {
  clinicId: string;
  clinicName: string;
  clinicEmail: string;
  authUserId: string;
}

export const ClinicActions = ({ clinicId, clinicName, clinicEmail, authUserId }: ClinicActionsProps) => {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignInAsClinic = async () => {
    try {
      setIsSigningIn(true);
      console.log("Signing in as clinic:", clinicEmail);

      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      // Call the edge function to get a one-time password
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-signin-as-clinic`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ clinicUserId: authUserId }),
        }
      );

      const data = await response.json();
      console.log("Edge function response:", data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate login token');
      }

      if (!data.token) {
        throw new Error('No token received from server');
      }

      // Sign out current admin user first
      await supabase.auth.signOut();

      // Use the token to sign in as the clinic
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: clinicEmail,
        password: data.token,
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        throw signInError;
      }

      // Redirect to clinic dashboard after successful sign in
      window.location.href = '/clinic/dashboard';
      
      toast.success(`Signed in as ${clinicName}`);
    } catch (error) {
      console.error("Error in sign in as clinic handler:", error);
      toast.error(error instanceof Error ? error.message : "Failed to sign in as clinic");
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleSignInAsClinic}
        disabled={isSigningIn}
      >
        {isSigningIn ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign in as Clinic'
        )}
      </Button>
    </div>
  );
};