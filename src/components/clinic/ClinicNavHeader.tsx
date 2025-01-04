import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Grid, MessageSquare, Search, Settings, User, Users } from "lucide-react";

export function ClinicNavHeader() {
  return (
    <div className="sticky top-0 w-full bg-white rounded-2xl px-10 py-6 flex items-center justify-between z-10">
      {/* Left side - Logo and nav items */}
      <div className="flex items-center space-x-10">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">L</span>
          </div>
          <span className="font-semibold text-lg">Lovable</span>
        </div>
        
        <nav className="flex items-center space-x-8">
          <button className="flex items-center space-x-2 bg-primary text-white px-5 py-2.5 rounded-lg text-base">
            <Grid className="h-5 w-5" />
            <span>Dashboard</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 text-base">
            <Users className="h-5 w-5" />
            <span>Employees</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 text-base">
            <User className="h-5 w-5" />
            <span>Client</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 text-base">
            <MessageSquare className="h-5 w-5" />
            <span>Feedback</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 text-base">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      {/* Right side - Search, notifications and profile */}
      <div className="flex items-center space-x-8">
        <div className="relative">
          <Search className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="pl-12 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base w-64"
          />
        </div>
        <button className="relative text-gray-500 hover:text-gray-700">
          <Bell className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            2
          </span>
        </button>
        <Avatar className="h-10 w-10">
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}