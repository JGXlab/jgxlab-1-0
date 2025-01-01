import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatsCard } from "@/components/admin/dashboard/StatsCard";
import { OverviewChart } from "@/components/admin/dashboard/OverviewChart";
import { DiagnoseChart } from "@/components/admin/dashboard/DiagnoseChart";
import { TodaySchedule } from "@/components/admin/dashboard/TodaySchedule";
import { LatestVisits } from "@/components/admin/dashboard/LatestVisits";
import { supabase } from "@/integrations/supabase/client";

// Define the mock data
const mockDiagnoseData = [
  { name: "Type A", value: 30, color: "#4F46E5" },
  { name: "Type B", value: 25, color: "#22C55E" },
  { name: "Type C", value: 45, color: "#EF4444" },
];

const mockOverviewData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Apr", value: 800 },
  { name: "May", value: 500 },
];

const mockAppointments = [
  {
    name: "John Doe",
    specialty: "General",
    time: "09:00 AM",
    status: "Completed",
    avatar: "/placeholder.svg",
  },
  {
    name: "Jane Smith",
    specialty: "Cardiology",
    time: "10:30 AM",
    status: "Pending",
    avatar: "/placeholder.svg",
  },
];

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
      label: "Total Patients",
      value: "120",
      change: "+4.5%",
      trend: [3, 4, 5, 4, 5, 6],
      positive: true,
      subtitle: "Last 7 days"
    },
    {
      label: "Total Appointments",
      value: "80",
      change: "-2.5%",
      trend: [6, 5, 4, 3, 4, 3],
      positive: false,
      subtitle: "Last 7 days"
    },
    {
      label: "Total Clinics",
      value: "10",
      change: "+10.0%",
      trend: [2, 3, 4, 3, 4, 5],
      positive: true,
      subtitle: "Last 7 days"
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              label={stat.label}
              value={stat.value}
              change={stat.change}
              trend={stat.trend}
              positive={stat.positive}
              subtitle={stat.subtitle}
            />
          ))}
        </div>
        <div className="bg-white rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6">Overview</h3>
          <OverviewChart data={mockOverviewData} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-6">
            <DiagnoseChart data={mockDiagnoseData} />
          </div>
          <TodaySchedule />
        </div>
        <LatestVisits appointments={mockAppointments} />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;