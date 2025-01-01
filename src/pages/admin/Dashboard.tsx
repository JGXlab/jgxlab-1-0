import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StatsCard } from "@/components/admin/dashboard/StatsCard";
import { OverviewChart } from "@/components/admin/dashboard/OverviewChart";
import { DiagnoseChart } from "@/components/admin/dashboard/DiagnoseChart";
import { TodaySchedule } from "@/components/admin/dashboard/TodaySchedule";
import { LatestVisits } from "@/components/admin/dashboard/LatestVisits";
import { Search, Bell } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.log("No user found, redirecting to login");
          navigate("/admin/login");
          return;
        }

        console.log("Checking admin status for user:", user.id);
        
        // Verify admin status
        const { data: adminCheck, error: adminError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .limit(1)
          .single();

        if (adminError) {
          console.error("Error checking admin status:", adminError);
          navigate("/admin/login");
          return;
        }

        if (!adminCheck?.is_admin) {
          console.log("User is not an admin, redirecting to login");
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You must be an admin to access this page.",
          });
          navigate("/admin/login");
          return;
        }

        console.log("Admin access verified");
      } catch (error) {
        console.error("Error in admin authentication:", error);
        navigate("/admin/login");
      }
    };

    checkAdminAuth();
  }, [navigate, toast]);

  const statsData = [
    {
      label: "Patients",
      value: "6025",
      change: "68.05%",
      trend: [3, 4, 3, 5, 3],
      positive: true,
      subtitle: "Since last week"
    },
    {
      label: "New This Week",
      value: "4152",
      change: "4.17%",
      trend: [2, 3, 4, 3, 2],
      positive: true,
      subtitle: "Since last week"
    },
    {
      label: "Critical Alerts",
      value: "5948",
      change: "82.05%",
      trend: [4, 2, 3, 5, 4],
      positive: false,
      subtitle: "Since last week"
    },
    {
      label: "Appointments",
      value: "5626",
      change: "27.47%",
      trend: [3, 4, 5, 4, 3],
      positive: true,
      subtitle: "Since last week"
    }
  ];

  const overviewData = [
    { name: "Jan", value: 30000 },
    { name: "Feb", value: 25000 },
    { name: "Mar", value: 28000 },
    { name: "Apr", value: 32000 },
    { name: "May", value: 27000 },
    { name: "Jun", value: 35000 },
    { name: "Jul", value: 47500 },
    { name: "Aug", value: 30000 },
    { name: "Sep", value: 25000 },
    { name: "Oct", value: 32000 },
    { name: "Nov", value: 28000 },
    { name: "Dec", value: 30000 }
  ];

  const diagnoseData = [
    { name: "Neurology", value: 120, color: "#4F46E5" },
    { name: "Oncology", value: 30, color: "#F97316" },
    { name: "Urology", value: 24, color: "#EF4444" }
  ];

  const appointments = [
    {
      name: "Esther Howard",
      specialty: "Dermatology",
      time: "8:44",
      status: "Today",
      avatar: "/placeholder.svg"
    },
    {
      name: "Eleanor Pena",
      specialty: "Gastroenterology",
      time: "8:54",
      status: "Today",
      avatar: "/placeholder.svg"
    },
    {
      name: "Brooklyn Simmons",
      specialty: "Ophthalmology",
      time: "7:30",
      status: "Today",
      avatar: "/placeholder.svg"
    },
    {
      name: "Cameron Williamson",
      specialty: "Rheumatology",
      time: "12:23",
      status: "Today",
      avatar: "/placeholder.svg"
    }
  ];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search anything here ..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="p-2 relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <img src="/placeholder.svg" alt="Profile" className="w-10 h-10 rounded-full" />
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg">
          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
          Overview
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600">
          Medical Reports
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600">
          Patients Overview
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600">
          Diagnose
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">Overview</h3>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">$138,500</p>
                <span className="text-green-500 text-sm">+13.45%</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-1 bg-blue-600 text-white rounded-lg text-sm">1 Year</button>
              <button className="px-4 py-1 text-gray-600 text-sm">6 Months</button>
              <button className="px-4 py-1 text-gray-600 text-sm">3 Months</button>
              <button className="px-4 py-1 text-gray-600 text-sm">1 Month</button>
            </div>
          </div>
          <OverviewChart data={overviewData} />
        </div>
        <div className="bg-white rounded-xl p-6">
          <DiagnoseChart data={diagnoseData} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="col-span-2">
          <TodaySchedule />
        </div>
        <div>
          <LatestVisits appointments={appointments} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
