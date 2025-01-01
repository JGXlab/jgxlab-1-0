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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
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
    <div 
      className={cn(
        "fixed left-0 top-0 h-full flex transition-all duration-300 ease-spring z-50",
        isCollapsed ? "w-[45px]" : "w-full sm:w-48" // Changed from w-[60px] and sm:w-64
      )}
    >
      <nav className="w-full bg-white p-3 relative shadow-sm"> {/* Changed padding from p-4 */}
        <div className={cn(
          "mb-6 flex items-center transition-all duration-300 ease-spring", // Reduced margin from mb-8
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-primary animate-fade-in"> {/* Reduced text size from 2xl */}
              Admin Portal
            </h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 transition-transform duration-300 ease-spring hover:bg-accent" // Reduced button size from h-8 w-8
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
                  "flex items-center p-2 rounded-lg transition-all duration-200 ease-spring group", // Reduced padding from p-3
                  isCollapsed ? "justify-center" : "space-x-3",
                  isActive(item.path) 
                    ? "bg-accent text-primary shadow-sm" 
                    : "text-secondary hover:bg-accent/50 hover:text-primary"
                )}
              >
                <Icon className={cn(
                  "h-4 w-4 flex-shrink-0 transition-transform duration-200 ease-spring", // Reduced icon size from h-5 w-5
                  !isActive(item.path) && "group-hover:scale-110"
                )} />
                {!isCollapsed && (
                  <span className="font-medium text-xs">{item.label}</span> // Reduced text size from sm
                )}
              </Link>
            );
          })}
        </div>

        <div className="absolute bottom-4 left-0 right-0 px-3"> {/* Reduced padding from px-4 */}
          <Button
            variant="ghost"
            className={cn(
              "w-full transition-colors duration-200 ease-spring",
              "text-destructive hover:text-destructive/90 hover:bg-destructive/10",
              isCollapsed ? "justify-center p-2" : "justify-start space-x-3 p-2" // Reduced padding from p-3
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" /> {/* Reduced icon size from h-5 w-5 */}
            {!isCollapsed && <span className="text-xs">Logout</span>} {/* Reduced text size */}
          </Button>
        </div>
      </nav>
      <Separator orientation="vertical" className="h-full" />
    </div>
  );
};