import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        console.log("Checking admin access...");
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("Error getting user:", userError);
          throw new Error("Authentication failed");
        }
        
        if (!user) {
          console.log("No user found, redirecting to login");
          navigate("/admin/login");
          return;
        }

        console.log("User found, checking admin role for:", user.id);
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          throw new Error("Failed to verify admin access");
        }

        console.log("Profile data:", profile);
        if (!profile || profile.role !== 'admin') {
          console.log("User is not an admin, redirecting to login");
          navigate("/admin/login");
          return;
        }

        console.log("Admin access granted!");
        setIsLoading(false);
      } catch (error) {
        console.error("Admin guard error:", error);
        toast({
          variant: "destructive",
          title: "Access Error",
          description: error instanceof Error ? error.message : "Failed to verify admin access",
        });
        navigate("/admin/login");
      }
    };

    checkAdmin();
  }, [navigate, toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};