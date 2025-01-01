import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const DesignGuard = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [isDesigner, setIsDesigner] = useState(false);

  useEffect(() => {
    const checkDesignerRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      setIsDesigner(profile?.role === 'designer');
      setLoading(false);
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