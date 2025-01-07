import { DesignLayout } from "@/components/design/DesignLayout";
import { Card } from "@/components/ui/card";
import { Bell, Search, LayoutDashboard, FileCheck, Settings, UserRound, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardStatusCards } from "@/components/design/dashboard/DashboardStatusCards";
import { motion } from "framer-motion";
import { DashboardCharts } from "@/components/design/dashboard/DashboardCharts";

export default function DesignDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      console.log("Designer logging out...");
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your designer account.",
      });
      navigate("/design/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };

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
            last_name,
            clinics (
              name,
              doctor_name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const stats = {
    pending: labScripts.filter(script => script.status === 'pending').length,
    inProgress: labScripts.filter(script => script.status === 'in_progress').length,
    paused: labScripts.filter(script => script.status === 'paused').length,
    onHold: labScripts.filter(script => script.status === 'on_hold').length,
    incomplete: labScripts.filter(script => 
      ['pending', 'in_progress', 'paused', 'on_hold'].includes(script.status)
    ).length,
    completed: labScripts.filter(script => script.status === 'completed').length,
    all: labScripts.length,
  };

  return (
    <DesignLayout>
      <div className="flex flex-col max-w-[1400px] w-full mx-auto h-screen py-8">
        <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
          <div className="sticky top-0 w-full bg-white rounded-t-2xl px-6 py-3 flex items-center justify-between z-10">
            <div className="flex items-center space-x-6">
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight font-inter">JGX Digital Lab</span>
                <span className="text-xs text-muted-foreground">Designer Portal</span>
              </div>
              
              <nav className="flex items-center space-x-3 border border-gray-200 rounded-full py-2 h-10">
                {[
                  { path: "/design/dashboard", icon: LayoutDashboard, label: "Dashboard" },
                  { path: "/design/labscripts", icon: FileCheck, label: "Lab Scripts" },
                  { path: "/design/settings", icon: Settings, label: "Settings" },
                  { path: "/design/myprofile", icon: UserRound, label: "My Profile" },
                ].map((item) => (
                  <button 
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center space-x-1.5 px-4 h-10 rounded-full transition-all duration-200 ${
                      isActivePath(item.path) 
                        ? "bg-[#8B5CF6] text-white shadow-sm" 
                        : "text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

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
                    <AvatarFallback className="bg-[#8B5CF6]/10 text-[#8B5CF6]">
                      <UserRound className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <motion.div 
            className="p-4 sm:p-6 lg:p-8 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DashboardStatusCards stats={stats} />
            <DashboardCharts labScripts={labScripts} />
          </motion.div>
        </ScrollArea>
      </div>
    </DesignLayout>
  );
}