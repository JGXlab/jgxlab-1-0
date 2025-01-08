import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        console.log("Checking admin access...");
        
        // Get the current session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw new Error("Session verification failed");
        }

        if (!session) {
          console.log("No active session found, redirecting to login");
          navigate("/admin/login");
          return;
        }

        console.log("Session found, verifying user:", session.user.id);
        
        // Get user profile to check role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          throw new Error("Failed to verify admin access");
        }

        console.log("Profile data:", profile);
        if (!profile || profile.role !== 'admin') {
          console.log("User is not an admin, redirecting to login");
          await supabase.auth.signOut();
          navigate("/admin/login");
          return;
        }

        console.log("Admin access granted!");
        setIsLoading(false);
      } catch (error) {
        console.error("Admin guard error:", error);
        // Sign out the user if there's any error
        await supabase.auth.signOut();
        toast({
          variant: "destructive",
          title: "Access Error",
          description: error instanceof Error ? error.message : "Failed to verify admin access",
        });
        navigate("/admin/login");
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      if (event === 'SIGNED_OUT') {
        navigate("/admin/login");
      } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        checkAdmin();
      }
    });

    // Initial check
    checkAdmin();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Verifying access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};