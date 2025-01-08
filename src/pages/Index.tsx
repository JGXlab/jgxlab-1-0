import { LoginForm } from "@/components/auth/LoginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        console.log("Active session found on Index page, checking user role");
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          return;
        }

        if (profile?.role === 'clinic') {
          console.log("Valid clinic user found, redirecting to dashboard");
          navigate("/clinic/dashboard", { replace: true });
        }
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
      <LoginForm />
    </div>
  );
};

export default Index;