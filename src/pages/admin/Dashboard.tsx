import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/admin/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (error || !profile?.is_admin) {
        console.error("Admin access check failed:", error);
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You don't have permission to access this page.",
        });
        navigate("/admin/login");
      }
    };

    checkAdminStatus();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Overview Cards */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-primary">0</p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-primary">0</p>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Active Clinics</h3>
            <p className="text-3xl font-bold text-primary">0</p>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="text-gray-500">No recent activity to display</div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;