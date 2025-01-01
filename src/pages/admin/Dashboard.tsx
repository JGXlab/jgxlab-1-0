import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatsCard } from "@/components/admin/dashboard/StatsCard";
import { OverviewChart } from "@/components/admin/dashboard/OverviewChart";
import { DiagnoseChart } from "@/components/admin/dashboard/DiagnoseChart";
import { TodaySchedule } from "@/components/admin/dashboard/TodaySchedule";
import { LatestVisits } from "@/components/admin/dashboard/LatestVisits";
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

  const statsData = [
    {
      title: "Total Patients",
      value: 120,
      change: 5,
      percentage: 4.5,
    },
    {
      title: "Total Appointments",
      value: 80,
      change: -2,
      percentage: -2.5,
    },
    {
      title: "Total Clinics",
      value: 10,
      change: 1,
      percentage: 10.0,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statsData.map((stat) => (
            <StatsCard key={stat.title} title={stat.title} value={stat.value} change={stat.change} percentage={stat.percentage} />
          ))}
        </div>
        <OverviewChart />
        <DiagnoseChart />
        <TodaySchedule />
        <LatestVisits />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
