import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log("No user found, redirecting to admin login");
          navigate("/admin/login");
          return;
        }

        console.log("Checking admin role for user:", user.id);

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        console.log("Profile data:", profile);
        console.log("Profile error:", error);

        if (error) {
          console.error("Error fetching profile:", error);
          navigate("/admin/login");
          return;
        }

        if (!profile) {
          console.error("No profile found for user:", user.id);
          navigate("/admin/login");
          return;
        }

        if (profile.role !== 'admin') {
          console.log("User is not an admin. Role:", profile.role);
          navigate("/admin/login");
          return;
        }

        console.log("Admin access granted for user:", user.id);
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking admin access:", error);
        navigate("/admin/login");
      }
    };

    checkAdminAccess();
  }, [navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return <>{children}</>;
};