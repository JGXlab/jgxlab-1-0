import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "./dashboard/StatsCard";
import { OverviewChart } from "./dashboard/OverviewChart";
import { DiagnoseChart } from "./dashboard/DiagnoseChart";
import { LatestVisits } from "./dashboard/LatestVisits";
import { TodaySchedule } from "./dashboard/TodaySchedule";

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
    subtitle: "Since last week"
  },
  {
    label: "New This Week",
    value: "4152",
    change: "+4.17%",
    trend: [25, 45, 30, 35, 30, 35],
    positive: true,
    subtitle: "Since last week"
  },
  {
    label: "Critical Alerts",
    value: "5948",
    change: "-82.05%",
    trend: [45, 30, 35, 25, 45, 30],
    positive: false,
    subtitle: "Since last week"
  },
  {
    label: "Appointments",
    value: "5626",
    change: "+27.47%",
    trend: [30, 35, 45, 30, 35, 25],
    positive: true,
    subtitle: "Since last week"
  },
];

const appointments = [
  {
    name: "Esther Howard",
    specialty: "Dermatology",
    time: "8:44",
    avatar: "/lovable-uploads/3eb155ee-f31c-4391-b127-a5f688d081f7.png",
    status: "Today"
  },
  {
    name: "Eleanor Pena",
    specialty: "Gastroenterology",
    time: "8:54",
    avatar: "/lovable-uploads/3eb155ee-f31c-4391-b127-a5f688d081f7.png",
    status: "Today"
  },
  {
    name: "Brooklyn Simmons",
    specialty: "Ophthalmology",
    time: "7:39",
    avatar: "/lovable-uploads/3eb155ee-f31c-4391-b127-a5f688d081f7.png",
    status: "Today"
  },
  {
    name: "Cameron Williamson",
    specialty: "Rheumatology",
    time: "12:23",
    avatar: "/lovable-uploads/3eb155ee-f31c-4391-b127-a5f688d081f7.png",
    status: "Today"
  },
];

export const ClinicDashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-4">
          <input
            type="search"
            placeholder="Search anything here..."
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-64"
          />
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        <Button variant="ghost" className="rounded-full bg-white hover:bg-gray-50 text-blue-600 font-medium">
          Overview
        </Button>
        <Button variant="ghost" className="rounded-full hover:bg-gray-50 text-gray-600 font-medium">
          Medical Reports
        </Button>
        <Button variant="ghost" className="rounded-full hover:bg-gray-50 text-gray-600 font-medium">
          Patients Overview
        </Button>
        <Button variant="ghost" className="rounded-full hover:bg-gray-50 text-gray-600 font-medium">
          Diagnose
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-1">Overview</h3>
                <p className="text-sm text-gray-500">Avg per month</p>
                <p className="text-2xl font-bold mt-1">
                  $138,500 <span className="text-sm text-green-500">+13.45%</span>
                </p>
              </div>
              <Tabs defaultValue="1y" className="w-auto">
                <TabsList className="bg-gray-100/80">
                  <TabsTrigger value="1y" className="text-sm">1 Year</TabsTrigger>
                  <TabsTrigger value="6m" className="text-sm">6 Months</TabsTrigger>
                  <TabsTrigger value="3m" className="text-sm">3 Months</TabsTrigger>
                  <TabsTrigger value="1m" className="text-sm">1 Month</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <OverviewChart data={monthlyData} />
          </CardContent>
        </Card>
        <DiagnoseChart data={pieData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodaySchedule />
        <LatestVisits appointments={appointments} />
      </div>
    </div>
  );
};