import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Bell, Search } from "lucide-react";

const Notifications = () => {
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search notifications..."
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
          All Notifications
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600">
          Unread
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600">
          Important
        </button>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-center h-40 text-gray-400">
          <div className="text-center">
            <Bell className="w-12 h-12 mx-auto mb-4" />
            <p>No new notifications</p>
          </div>
        </div>
      </Card>
    </AdminLayout>
  );
};

export default Notifications;