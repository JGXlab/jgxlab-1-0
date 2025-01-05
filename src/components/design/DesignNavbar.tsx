import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileCheck, Settings, UserRound, LogOut, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DesignNavbarProps {
  isCollapsed?: boolean;
  setIsCollapsed?: (value: boolean) => void;
}

export const DesignNavbar = ({ isCollapsed, setIsCollapsed }: DesignNavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isActive = (path: string) => location.pathname === path;

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

  return (
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
              isActive("/design/dashboard") 
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
              isActive("/design/labscripts") 
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
              isActive("/design/settings") 
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
              isActive("/design/myprofile") 
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
          <DropdownMenuContent 
            align="end" 
            className="w-48 bg-white border border-gray-200 shadow-lg rounded-lg py-1 mt-1"
          >
            <DropdownMenuItem 
              onClick={handleLogout}
              className="flex items-center space-x-2 cursor-pointer text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50 px-4 py-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};