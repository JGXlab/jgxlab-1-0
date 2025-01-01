import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      // If no user, redirect to login
      if (!user) {
        console.log("No user found - redirecting to login");
        navigate("/admin/login");
        return;
      }

      // Get user's profile with role
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      console.log("Profile check result:", { profile, error });

      // If not admin, redirect to login
      if (!profile || profile.role !== 'admin') {
        console.log("Not an admin - redirecting to login");
        navigate("/admin/login");
        return;
      }

      console.log("Admin access granted");
      setIsLoading(false);
    };

    checkAdmin();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};