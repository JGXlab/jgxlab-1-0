import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Sun, Moon, RotateCcw, LayoutDashboard, FolderClosed, ArrowLeftRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const revenueData = [
  { month: "Jan", value: 25000 },
  { month: "Feb", value: 30000 },
  { month: "Mar", value: 35000 },
  { month: "Apr", value: 20000 },
  { month: "May", value: 38000 },
  { month: "Jun", value: 45000 },
  { month: "July", value: 30000 },
  { month: "Aug", value: 35000 },
  { month: "Oct", value: 25000 },
  { month: "Nov", value: 38000 },
  { month: "Dec", value: 32000 },
];

const performanceData = [
  { month: "Sep", value: 22000 },
  { month: "Oct", value: 35000 },
  { month: "Nov", value: 28000 },
  { month: "Dec", value: 45000 },
];

const transactions = [
  {
    name: "Robert Carter",
    avatar: "/lovable-uploads/f7b0a4d1-3f84-40bd-b1a8-2844b36a34f7.png",
    status: "Pending",
    date: "June 14, 2023",
    amount: 2438.71,
    type: "credit",
  },
  {
    name: "Daniel Foster",
    avatar: "/lovable-uploads/f7b0a4d1-3f84-40bd-b1a8-2844b36a34f7.png",
    status: "Done",
    date: "June 12, 2023",
    amount: 526.47,
    type: "debit",
  },
];

export const ClinicDashboard = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">12th Oct 2023</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="search"
              placeholder="Search"
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white w-64 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Sun className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Moon className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <RotateCcw className="h-5 w-5 text-gray-500" />
            </Button>
            <div className="flex items-center gap-2 ml-2">
              <img
                src="/lovable-uploads/f7b0a4d1-3f84-40bd-b1a8-2844b36a34f7.png"
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium">John Smith</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-blue-500 text-white rounded-2xl">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-white/20 rounded-lg">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <h3 className="font-medium">Total Projects</h3>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-semibold">10,724</h2>
            <p className="text-sm text-blue-100 mt-1">
              All running & completed projects
            </p>
          </div>
        </Card>

        <Card className="p-6 bg-white rounded-2xl">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FolderClosed className="h-5 w-5 text-gray-600" />
            </div>
            <h3 className="font-medium text-gray-900">Completed Projects</h3>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-semibold text-gray-900">9,801</h2>
            <p className="text-sm text-red-500 mt-1">-11% Completion rate this month</p>
          </div>
        </Card>

        <Card className="p-6 bg-white rounded-2xl">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-gray-100 rounded-lg">
              <ArrowLeftRight className="h-5 w-5 text-gray-600" />
            </div>
            <h3 className="font-medium text-gray-900">Running Projects</h3>
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-semibold text-gray-900">923</h2>
            <p className="text-sm text-green-500 mt-1">+8% Running projects increases</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="p-6 bg-white rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Revenue Chart</h3>
              <select className="px-4 py-2 rounded-lg border border-gray-200 text-sm">
                <option>This Year</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#E2E8F0"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                  <Bar
                    dataKey="value"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="mt-6 p-6 bg-white rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Transactions</h3>
              <select className="px-4 py-2 rounded-lg border border-gray-200 text-sm">
                <option>All Data</option>
                <option>This Month</option>
              </select>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-sm text-gray-500">
                  <th className="text-left font-medium pb-4">Name</th>
                  <th className="text-left font-medium pb-4">Status</th>
                  <th className="text-left font-medium pb-4">Date</th>
                  <th className="text-right font-medium pb-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={index} className="text-sm">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={transaction.avatar}
                          alt={transaction.name}
                          className="w-8 h-8 rounded-full"
                        />
                        {transaction.name}
                      </div>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          transaction.status === "Pending"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">{transaction.date}</td>
                    <td className={`py-3 text-right ${
                      transaction.type === "credit" ? "text-green-500" : "text-red-500"
                    }`}>
                      {transaction.type === "credit" ? "+" : "-"}${transaction.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-white rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-blue-500 font-medium px-3 py-1 bg-blue-50 rounded-full">
                Team Review
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-1">Oxish Project Team</h3>
            <p className="text-sm text-gray-500 mb-4">
              Oxish is built for every use of your project
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>14 . 10 . 2023</span>
              <span>15 Members</span>
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Notion File</div>
              <div className="flex -space-x-2">
                <img
                  src="/lovable-uploads/f7b0a4d1-3f84-40bd-b1a8-2844b36a34f7.png"
                  alt="Team member"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img
                  src="/lovable-uploads/f7b0a4d1-3f84-40bd-b1a8-2844b36a34f7.png"
                  alt="Team member"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
                <img
                  src="/lovable-uploads/f7b0a4d1-3f84-40bd-b1a8-2844b36a34f7.png"
                  alt="Team member"
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-gray-500 font-medium px-3 py-1 bg-gray-100 rounded-full">
                Meeting
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-1">
              Upcoming Event Planning Discussion
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Oxish is built for every use of your project
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              <span>16th Oct</span>
              <span>11:00 - 12:00</span>
            </div>
            <Button
              variant="outline"
              className="w-full justify-center"
            >
              Meeting Zoom Link
            </Button>
          </Card>

          <Card className="p-6 bg-white rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Team Performance</h3>
              <span className="text-sm text-gray-500">Last 4 months</span>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#E2E8F0"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Bar
                    dataKey="value"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};