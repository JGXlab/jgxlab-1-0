import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, LayoutDashboard, Users, FileText, Settings, UserRound, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function ClinicNavHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="sticky top-0 w-full bg-white rounded-t-2xl px-6 py-3 flex items-center justify-between z-10">
      {/* Left side - Logo and nav items */}
      <div className="flex items-center space-x-6">
        <div className="flex flex-col">
          <span className="font-semibold text-base">JGX Digital Lab</span>
          <span className="text-xs text-muted-foreground">Clinic Portal</span>
        </div>
        
        <nav className="flex items-center space-x-3 border border-gray-200 rounded-full py-2 h-10">
          <button 
            onClick={() => navigate("/clinic/dashboard")}
            className={`flex items-center space-x-1.5 px-4 h-10 rounded-full transition-all duration-200 ${
              isActivePath("/clinic/dashboard") 
                ? "bg-primary text-white shadow-sm" 
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span className="font-medium text-sm">Dashboard</span>
          </button>
          
          <button 
            onClick={() => navigate("/clinic/patients")}
            className={`flex items-center space-x-1.5 px-4 h-10 rounded-full transition-all duration-200 ${
              isActivePath("/clinic/patients") 
                ? "bg-primary text-white shadow-sm" 
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <Users className="h-3.5 w-3.5" />
            <span className="font-medium text-sm">Patients</span>
          </button>
          
          <button 
            onClick={() => navigate("/clinic/submittedlabscripts")}
            className={`flex items-center space-x-1.5 px-4 h-10 rounded-full transition-all duration-200 ${
              isActivePath("/clinic/submittedlabscripts") 
                ? "bg-primary text-white shadow-sm" 
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span className="font-medium text-sm">Lab Scripts</span>
          </button>
          
          <button 
            onClick={() => navigate("/clinic/myaccount")}
            className={`flex items-center space-x-1.5 px-4 h-10 rounded-full transition-all duration-200 ${
              isActivePath("/clinic/myaccount") 
                ? "bg-primary text-white shadow-sm" 
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <Settings className="h-3.5 w-3.5" />
            <span className="font-medium text-sm">Settings</span>
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
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
              onClick={() => navigate("/clinic/myprofile")}
              className="flex items-center space-x-2 cursor-pointer text-sm font-medium text-gray-700 hover:text-[#8B5CF6] focus:text-[#8B5CF6]"
            >
              <UserRound className="h-4 w-4" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleLogout}
              className="flex items-center space-x-2 cursor-pointer text-sm font-medium text-gray-700 hover:text-[#8B5CF6] focus:text-[#8B5CF6]"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}