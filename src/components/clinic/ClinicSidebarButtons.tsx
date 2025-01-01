import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  UserCircle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type SidebarButton = {
  icon: typeof LayoutDashboard;
  label: string;
  path: string;
  badge?: number;
};

const sidebarButtons: SidebarButton[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/clinic/dashboard",
  },
  {
    icon: Users,
    label: "Patients",
    path: "/clinic/patients",
  },
  {
    icon: FileText,
    label: "Lab Requests",
    path: "/clinic/lab-request/new",
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/clinic/settings",
  },
  {
    icon: UserCircle,
    label: "Profile",
    path: "/clinic/profile",
  },
];

export const ClinicSidebarButtons = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/");
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
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col gap-1 px-3">
        {sidebarButtons.map((button) => {
          const isActive = location.pathname === button.path;
          return (
            <Link
              key={button.label}
              to={button.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative group",
                isActive
                  ? "bg-[#EEF2FF] text-[#375BDC]"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <button.icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-[#375BDC]" : "text-gray-500 group-hover:text-gray-900"
                )}
              />
              <span className={cn(
                "font-medium text-sm",
                isActive ? "text-[#375BDC]" : "text-gray-500 group-hover:text-gray-900"
              )}>
                {button.label}
              </span>
              {button.badge && (
                <span className="absolute right-3 bg-red-400 text-white text-xs px-2 py-0.5 rounded-full">
                  {button.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
      
      <div className="px-3 pb-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg transition-colors text-[#ea384c] hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};