import { DesignLayout } from "@/components/design/DesignLayout";
import { Card } from "@/components/ui/card";
import { Bell, Search, LayoutDashboard, FileCheck, Clock, AlertCircle, Settings, UserRound } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DesignDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const { data: labScripts = [], isLoading } = useQuery({
    queryKey: ['design-dashboard-scripts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lab_scripts')
        .select(`
          *,
          patients (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const pendingScripts = labScripts.filter(script => script.status === 'pending').length;
  const inProgressScripts = labScripts.filter(script => script.status === 'in_progress').length;
  const completedScripts = labScripts.filter(script => script.status === 'completed').length;
  const urgentScripts = labScripts.filter(script => {
    const dueDate = new Date(script.due_date);
    const today = new Date();
    return dueDate <= today && script.status !== 'completed';
  }).length;

  return (
    <DesignLayout>
      <div className="flex flex-col max-w-[1400px] w-full mx-auto h-screen py-8">
        <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
          <div className="sticky top-0 w-full bg-white rounded-t-2xl px-6 py-3 flex items-center justify-between z-10">
            {/* Left side - Logo and nav items */}
            <div className="flex items-center space-x-6">
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight font-inter">JGX Digital Lab</span>
                <span className="text-xs text-muted-foreground">Designer Portal</span>
              </div>
              
              <nav className="flex items-center space-x-3 border border-gray-200 rounded-full py-2 h-10">
                <button 
                  onClick={() => navigate("/design/dashboard")}
                  className={`flex items-center space-x-1.5 px-4 h-10 rounded-full transition-all duration-200 ${
                    isActivePath("/design/dashboard") 
                      ? "bg-[#8B5CF6] text-white shadow-sm" 
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span className="font-medium text-sm">Dashboard</span>
                </button>
                
                <button 
                  onClick={() => navigate("/design/labscripts")}
                  className={`flex items-center space-x-1.5 px-4 h-10 rounded-full transition-all duration-200 ${
                    isActivePath("/design/labscripts") 
                      ? "bg-[#8B5CF6] text-white shadow-sm" 
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <FileCheck className="h-3.5 w-3.5" />
                  <span className="font-medium text-sm">Lab Scripts</span>
                </button>
                
                <button 
                  onClick={() => navigate("/design/settings")}
                  className={`flex items-center space-x-1.5 px-4 h-10 rounded-full transition-all duration-200 ${
                    isActivePath("/design/settings") 
                      ? "bg-[#8B5CF6] text-white shadow-sm" 
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span className="font-medium text-sm">Settings</span>
                </button>
                
                <button 
                  onClick={() => navigate("/design/myprofile")}
                  className={`flex items-center space-x-1.5 px-4 h-10 rounded-full transition-all duration-200 ${
                    isActivePath("/design/myprofile") 
                      ? "bg-[#8B5CF6] text-white shadow-sm" 
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  <UserRound className="h-3.5 w-3.5" />
                  <span className="font-medium text-sm">My Profile</span>
                </button>
              </nav>
            </div>

            {/* Right side - notifications and profile */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 w-64 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-sm"
                />
              </div>
              
              <button className="relative p-2 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] hover:bg-[#8B5CF6]/20 transition-all duration-200">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center border-2 border-white">
                  2
                </span>
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 ring-2 ring-[#8B5CF6]/20 ring-offset-2 ring-offset-white transition-all duration-200 hover:ring-[#8B5CF6]/40 cursor-pointer">
                    <AvatarFallback className="bg-[#8B5CF6]/10 text-[#8B5CF6]">D</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/design/myprofile')}>
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/design/settings')}>
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
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

            <Card className="p-6 backdrop-blur-sm bg-white/50 shadow-lg">
              <div className="text-center text-gray-500">
                <LayoutDashboard className="w-12 h-12 mx-auto mb-4" />
                <p>No recent activity</p>
              </div>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </DesignLayout>
  );
}