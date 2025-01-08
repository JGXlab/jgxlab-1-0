import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ClinicActionsProps {
  clinicEmail: string;
  clinicName: string;
}

export function ClinicActions({ clinicEmail, clinicName }: ClinicActionsProps) {
  const { toast } = useToast();

  const handleSignInAsClinic = async () => {
    try {
      console.log('Signing in as clinic:', clinicEmail);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No active session found');
      }

      const response = await fetch(
        'https://zuwhzwfdourrvrwhrajj.functions.supabase.co/admin-signin-as-clinic',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ clinicUserId: clinicEmail }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate login link');
      }

      // Use the token to sign in as the clinic
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: clinicEmail,
        password: data.token,
      });

      if (signInError) throw signInError;

      toast({
        title: "Success",
        description: `Signed in as ${clinicName}`,
      });
      
    } catch (error) {
      console.error('Error in sign in as clinic handler:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSignInAsClinic}
      className="bg-white border-[#D3E4FD] text-primary hover:bg-[#F8FAFC] hover:text-primary/90 transition-colors"
    >
      <LogIn className="w-4 h-4 mr-2" />
      Sign in as Clinic
    </Button>
  );
}