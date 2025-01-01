import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const DesignGuard = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isDesigner, setIsDesigner] = useState(false);

  useEffect(() => {
    const checkDesignerRole = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log("No active session found");
          setLoading(false);
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          setLoading(false);
          return;
        }

        console.log("User profile:", profile);
        setIsDesigner(profile?.role === 'designer');
        setLoading(false);
      } catch (error) {
        console.error("Error in checkDesignerRole:", error);
        setLoading(false);
      }
    };

    checkDesignerRole();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isDesigner) {
    return <Navigate to="/design/login" replace />;
  }

  return <>{children}</>;
};