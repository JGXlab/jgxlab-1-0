import { LayoutDashboard } from "lucide-react";
import { Card } from "@/components/ui/card";

export function EmptyState() {
  return (
    <Card className="p-6 backdrop-blur-sm bg-white/50 shadow-lg">
      <div className="text-center text-gray-500">
        <LayoutDashboard className="w-12 h-12 mx-auto mb-4" />
        <p>No recent activity</p>
      </div>
    </Card>
  );
}