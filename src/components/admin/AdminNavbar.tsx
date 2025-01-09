import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Bell,
  FileText,
  Settings,
  LogOut,
  Building,
  Palette,
  UserRound,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AdminNavbarProps {
  isCollapsed?: boolean;
  setIsCollapsed?: (value: boolean) => void;
}

export const AdminNavbar = ({ isCollapsed, setIsCollapsed }: AdminNavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/admin/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      icon: Users,
      label: "Patients",
      path: "/admin/patients",
    },
    {
      icon: Building,
      label: "Clinics",
      path: "/admin/clinics",
    },
    {
      icon: Palette,
      label: "Designers",
      path: "/admin/designers",
    },
    {
      icon: FileText,
      label: "Lab Scripts",
      path: "/admin/lab-scripts",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/admin/settings",
    },
  ];

  return (
    <div className="sticky top-0 w-full bg-white rounded-t-2xl px-6 py-3 flex items-center justify-between z-10">
      {/* Left side - Logo and nav items */}
      <div className="flex items-center space-x-6">
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight font-inter">JGX Digital Lab</span>
          <span className="text-xs text-muted-foreground">Admin Portal</span>
        </div>
        
        <nav className="flex items-center space-x-3 border border-gray-200 rounded-full py-2 h-10">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-1.5 px-4 h-10 rounded-full transition-all duration-200 ${
                  isActivePath(item.path)
                    ? "bg-[#4F46E5] text-white shadow-sm"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right side - notifications and profile */}
      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] hover:bg-[#4F46E5]/20 transition-all duration-200">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center border-2 border-white">
            2
          </span>
        </button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 ring-2 ring-[#4F46E5]/20 ring-offset-2 ring-offset-white transition-all duration-200 hover:ring-[#4F46E5]/40 cursor-pointer">
              <AvatarFallback className="bg-[#4F46E5]/10 text-[#4F46E5]">
                <UserRound className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-48 bg-white border border-gray-200 shadow-lg rounded-lg py-1 mt-1"
          >
            <DropdownMenuItem 
              onClick={() => navigate("/admin/settings")}
              className="flex items-center space-x-2 cursor-pointer text-sm font-medium text-gray-700 hover:text-[#4F46E5] hover:bg-gray-50 focus:text-[#4F46E5] focus:bg-gray-50 px-4 py-2"
            >
              <UserRound className="h-4 w-4" />
              <span>My Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleLogout}
              className="flex items-center space-x-2 cursor-pointer text-sm font-medium text-gray-700 hover:text-[#4F46E5] hover:bg-gray-50 focus:text-[#4F46E5] focus:bg-gray-50 px-4 py-2"
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