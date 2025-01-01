import { Search, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatsCard } from "@/components/clinic/dashboard/StatsCard";
import { OverviewChart } from "@/components/clinic/dashboard/OverviewChart";
import { DiagnoseChart } from "@/components/clinic/dashboard/DiagnoseChart";
import { TodaySchedule } from "@/components/clinic/dashboard/TodaySchedule";
import { LatestVisits } from "@/components/clinic/dashboard/LatestVisits";

export const ClinicDashboard = () => {
  const statsData = [
    {
      label: "Total Patients",
      value: "1,234",
      change: "+12.5%",
      trend: [3, 4, 3, 5, 3],
      positive: true,
      subtitle: "Since last month"
    },
    {
      label: "Active Orders",
      value: "156",
      change: "+8.2%",
      trend: [2, 3, 4, 3, 2],
      positive: true,
      subtitle: "Since last month"
    },
    {
      label: "Pending Results",
      value: "45",
      change: "-2.4%",
      trend: [4, 2, 3, 5, 4],
      positive: false,
      subtitle: "Since last month"
    },
    {
      label: "Completed Tests",
      value: "892",
      change: "+15.3%",
      trend: [3, 4, 5, 4, 3],
      positive: true,
      subtitle: "Since last month"
    }
  ];

  const overviewData = [
    { name: "Jan", value: 100 },
    { name: "Feb", value: 120 },
    { name: "Mar", value: 150 },
    { name: "Apr", value: 140 },
    { name: "May", value: 180 },
    { name: "Jun", value: 190 },
    { name: "Jul", value: 210 },
    { name: "Aug", value: 220 },
    { name: "Sep", value: 200 },
    { name: "Oct", value: 240 },
    { name: "Nov", value: 230 },
    { name: "Dec", value: 250 }
  ];

  const diagnoseData = [
    { name: "Blood Tests", value: 45, color: "#4F46E5" },
    { name: "Urine Tests", value: 30, color: "#F97316" },
    { name: "Other Tests", value: 25, color: "#EF4444" }
  ];

  const appointments = [
    {
      name: "John Smith",
      specialty: "Blood Test",
      time: "09:00",
      status: "Pending",
      avatar: "/placeholder.svg"
    },
    {
      name: "Sarah Johnson",
      specialty: "Urine Test",
      time: "10:30",
      status: "In Progress",
      avatar: "/placeholder.svg"
    },
    {
      name: "Michael Brown",
      specialty: "Blood Test",
      time: "11:45",
      status: "Completed",
      avatar: "/placeholder.svg"
    },
    {
      name: "Emily Davis",
      specialty: "Other Test",
      time: "14:15",
      status: "Scheduled",
      avatar: "/placeholder.svg"
    }
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Clinic Dashboard</h1>
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
          Lab Orders
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600">
          Test Results
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600">
          Analytics
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
              <h3 className="text-lg font-semibold mb-1">Tests Overview</h3>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">1,234</p>
                <span className="text-green-500 text-sm">+15.3%</span>
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
    </div>
  );
};