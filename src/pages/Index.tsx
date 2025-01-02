import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        console.log("No user found, redirecting to login");
        navigate("/admin/login");
        return;
      }

      console.log("User authenticated:", user.id);
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1280px] mx-auto px-4">
        <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
        <p className="mt-4">This is the main landing page for the application.</p>
      </div>
    </div>
  );
};

export default Index;
