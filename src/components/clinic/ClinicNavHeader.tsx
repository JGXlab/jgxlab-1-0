import { Grid, Users, User, MessageSquare, Settings, Search, Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function ClinicNavHeader() {
  return (
    <div className="w-full bg-white px-8 py-4 flex items-center justify-between">
      {/* Left side - Logo and nav items */}
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">L</span>
          </div>
          <span className="font-semibold">Lovable</span>
        </div>
        
        <nav className="flex items-center space-x-6">
          <button className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg">
            <Grid className="h-4 w-4" />
            <span>Dashboard</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
            <Users className="h-4 w-4" />
            <span>Employees</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
            <User className="h-4 w-4" />
            <span>Client</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
            <MessageSquare className="h-4 w-4" />
            <span>Feedback</span>
          </button>
          <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      {/* Right side - Search, notifications and profile */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <button className="relative text-gray-500 hover:text-gray-700">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            2
          </span>
        </button>
        <Avatar className="h-8 w-8">
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}