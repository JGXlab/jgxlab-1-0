import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        console.log("Checking admin access...");
        
        // First check if we have a valid session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw new Error("Authentication failed");
        }

        if (!session) {
          console.log("No active session found, redirecting to login");
          navigate("/admin/login");
          return;
        }

        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("User error:", userError);
          throw userError;
        }

        if (!user) {
          console.log("No user found, redirecting to login");
          navigate("/admin/login");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Profile error:", profileError);
          throw profileError;
        }

        if (!profile || profile.role !== "admin") {
          console.log("User is not an admin, redirecting");
          navigate("/admin/login");
          return;
        }

        console.log("Admin access verified");
        setIsLoading(false);
      } catch (error) {
        console.error("Admin guard error:", error);
        
        // Handle refresh token errors specifically
        if (error instanceof Error && error.message.includes('refresh_token')) {
          console.log("Refresh token error, signing out user");
          await supabase.auth.signOut();
        }
        
        toast({
          variant: "destructive",
          title: "Access Error",
          description: "You do not have permission to access this area.",
        });
        navigate("/admin/login");
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      if (event === 'SIGNED_OUT') {
        navigate("/admin/login");
      } else if (event === 'SIGNED_IN') {
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