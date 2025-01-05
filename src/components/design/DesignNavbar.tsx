import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileCheck, Settings, UserRound, LogOut, ChevronLeft, ChevronRight, Bell, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DesignNavbarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
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

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/design/dashboard",
    },
    {
      icon: FileCheck,
      label: "Lab Scripts",
      path: "/design/labscripts",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/design/settings",
    },
    {
      icon: UserRound,
      label: "My Profile",
      path: "/design/myprofile",
    },
  ];

  return (
    <div 
      className={cn(
        "fixed left-0 top-0 h-full flex transition-all duration-300 ease-spring z-50",
        isCollapsed ? "w-[60px]" : "w-full sm:w-64"
      )}
    >
      <nav className="w-full bg-white p-4 relative shadow-sm">
        <div className={cn(
          "mb-8 flex items-center transition-all duration-300 ease-spring",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && (
            <div className="flex flex-col animate-fade-in">
              <h1 className="text-2xl font-bold text-[#8B5CF6]">
                JGX Digital Lab
              </h1>
              <span className="text-sm text-gray-500">
                Designer Portal
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 transition-transform duration-300 ease-spring hover:bg-gray-50"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center p-3 rounded-lg transition-all duration-200 ease-spring group",
                  isCollapsed ? "justify-center" : "space-x-3",
                  isActive(item.path) 
                    ? "bg-[#EEF2FF] text-[#8B5CF6]" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#8B5CF6]"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0 transition-transform duration-200 ease-spring",
                  !isActive(item.path) && "group-hover:scale-110"
                )} />
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="absolute bottom-4 left-0 right-0 px-4">
          <Button
            variant="ghost"
            className={cn(
              "w-full transition-colors duration-200 ease-spring",
              "text-red-600 hover:text-red-700 hover:bg-red-50",
              isCollapsed ? "justify-center p-3" : "justify-start space-x-3 p-3"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </nav>
      <Separator orientation="vertical" className="h-full" />
    </div>
  );
};