import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
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
    <AdminLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="bg-white rounded-xl p-6">
          <p>Welcome to the admin dashboard</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;