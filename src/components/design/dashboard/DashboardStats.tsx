import { Card } from "@/components/ui/card";
import { Clock, FileCheck, AlertCircle, LayoutDashboard } from "lucide-react";

interface DashboardStatsProps {
  pendingScripts: number;
  inProgressScripts: number;
  urgentScripts: number;
  completedScripts: number;
}

export function DashboardStats({
  pendingScripts,
  inProgressScripts,
  urgentScripts,
  completedScripts,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-white">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">New Lab Scripts</span>
            <Clock className="h-5 w-5 text-[#8B5CF6]" />
          </div>
          <p className="text-2xl font-bold mt-2">{pendingScripts}</p>
        </div>
      </Card>

      <Card className="bg-white">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">In Progress</span>
            <FileCheck className="h-5 w-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{inProgressScripts}</p>
        </div>
      </Card>

      <Card className="bg-white">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Urgent</span>
            <AlertCircle className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{urgentScripts}</p>
        </div>
      </Card>

      <Card className="bg-white">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Completed</span>
            <LayoutDashboard className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{completedScripts}</p>
        </div>
      </Card>
    </div>
  );
}