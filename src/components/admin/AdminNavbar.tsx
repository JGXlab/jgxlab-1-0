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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminNavbarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export const AdminNavbar = ({ isCollapsed, setIsCollapsed }: AdminNavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      console.log("Admin logging out...");
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your admin account.",
      });
      navigate("/admin/login");
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
      icon: Bell,
      label: "Notifications",
      path: "/admin/notifications",
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
    <div className="sticky top-0 z-50 w-full bg-white border-b">
      <div className="flex h-16 items-center px-8 gap-8">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-[#8B5CF6]">
            JGX Digital Lab
          </h1>
          <span className="text-sm text-muted-foreground">
            Admin Portal
          </span>
        </div>

        <nav className="flex-1">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive(item.path)
                        ? "bg-[#8B5CF6]/10 text-[#8B5CF6]"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};