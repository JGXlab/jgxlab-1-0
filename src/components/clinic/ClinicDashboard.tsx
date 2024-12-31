import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatsCard } from "./dashboard/StatsCard";
import { OverviewChart } from "./dashboard/OverviewChart";
import { DiagnoseChart } from "./dashboard/DiagnoseChart";
import { LatestVisits } from "./dashboard/LatestVisits";

const monthlyData = [
  { name: "Jan", value: 30 },
  { name: "Feb", value: 25 },
  { name: "Mar", value: 35 },
  { name: "Apr", value: 40 },
  { name: "May", value: 28 },
  { name: "Jun", value: 45 },
  { name: "Jul", value: 47.5 },
  { name: "Aug", value: 32 },
  { name: "Sep", value: 30 },
  { name: "Oct", value: 38 },
  { name: "Nov", value: 35 },
  { name: "Dec", value: 32 },
];

const pieData = [
  { name: "Neurology", value: 120, color: "#4F46E5" },
  { name: "Oncology", value: 30, color: "#F97316" },
  { name: "Urology", value: 24, color: "#10B981" },
];

const statsData = [
  {
    label: "Patients",
    value: "6025",
    change: "+68.05%",
    trend: [30, 35, 25, 45, 30, 35],
    positive: true,
  },
  {
    label: "New This Week",
    value: "4152",
    change: "+4.17%",
    trend: [25, 45, 30, 35, 30, 35],
    positive: true,
  },
  {
    label: "Critical Alerts",
    value: "5948",
    change: "-82.05%",
    trend: [45, 30, 35, 25, 45, 30],
    positive: false,
  },
  {
    label: "Appointments",
    value: "5626",
    change: "+27.47%",
    trend: [30, 35, 45, 30, 35, 25],
    positive: true,
  },
];

const appointments = [
  {
    name: "Esther Howard",
    specialty: "Dermatology",
    time: "8:44",
    avatar: "/lovable-uploads/3eb155ee-f31c-4391-b127-a5f688d081f7.png",
  },
  {
    name: "Eleanor Pena",
    specialty: "Gastroenterology",
    time: "8:54",
    avatar: "/lovable-uploads/3eb155ee-f31c-4391-b127-a5f688d081f7.png",
  },
  {
    name: "Brooklyn Simmons",
    specialty: "Ophthalmology",
    time: "7:39",
    avatar: "/lovable-uploads/3eb155ee-f31c-4391-b127-a5f688d081f7.png",
  },
  {
    name: "Cameron Williamson",
    specialty: "Rheumatology",
    time: "12:23",
    avatar: "/lovable-uploads/3eb155ee-f31c-4391-b127-a5f688d081f7.png",
  },
];

export const ClinicDashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <input
            type="search"
            placeholder="Search anything here..."
            className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        <Button variant="ghost" className="rounded-full bg-white hover:bg-gray-50">
          Overview
        </Button>
        <Button variant="ghost" className="rounded-full hover:bg-gray-50">
          Medical Reports
        </Button>
        <Button variant="ghost" className="rounded-full hover:bg-gray-50">
          Patients Overview
        </Button>
        <Button variant="ghost" className="rounded-full hover:bg-gray-50">
          Diagnose
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OverviewChart data={monthlyData} />
        <DiagnoseChart data={pieData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-6">Today Schedule</h3>
            <div className="space-y-4">
              {/* Schedule timeline would go here */}
            </div>
          </CardContent>
        </Card>
        <LatestVisits appointments={appointments} />
      </div>
    </div>
  );
};