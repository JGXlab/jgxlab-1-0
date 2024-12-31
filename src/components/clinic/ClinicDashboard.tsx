import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

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
          <Card
            key={index}
            className="bg-white hover:shadow-lg transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  <p
                    className={`text-sm mt-1 ${
                      stat.positive ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stat.change}
                  </p>
                </div>
                <div className="w-24 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stat.trend.map((value, i) => ({ value }))}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={stat.positive ? "#4F46E5" : "#EF4444"}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold">Overview</h3>
                <p className="text-sm text-gray-500">Avg per month</p>
                <p className="text-2xl font-bold mt-1">
                  $138,500{" "}
                  <span className="text-sm text-green-500">+13.45%</span>
                </p>
              </div>
              <Tabs defaultValue="1y" className="w-auto">
                <TabsList>
                  <TabsTrigger value="1y" className="text-sm">
                    1 Year
                  </TabsTrigger>
                  <TabsTrigger value="6m" className="text-sm">
                    6 Months
                  </TabsTrigger>
                  <TabsTrigger value="3m" className="text-sm">
                    3 Months
                  </TabsTrigger>
                  <TabsTrigger value="1m" className="text-sm">
                    1 Month
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-6">Avg Diagnose</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">
                      {item.value} {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
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

        <Card className="bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-6">Latest Visits</h3>
            <div className="space-y-4">
              {appointments.map((appointment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={appointment.avatar}
                      alt={appointment.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{appointment.name}</p>
                      <p className="text-sm text-gray-500">
                        {appointment.specialty}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{appointment.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};