import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
      console.log("Attempting to sign out");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error signing out:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to sign out. Please try again.",
        });
        return;
      }

      console.log("Successfully signed out");
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate("/design/login");
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
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
      icon: FileText,
      label: "Lab Scripts",
      path: "/design/labscripts",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/design/settings",
    },
    {
      icon: User,
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
              <h1 className="text-2xl font-bold text-primary">
                JGX Digital Lab
              </h1>
              <span className="text-sm text-muted-foreground">
                Designer Portal
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 transition-transform duration-300 ease-spring hover:bg-accent"
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
                    ? "bg-accent text-primary shadow-sm" 
                    : "text-secondary hover:bg-accent/50 hover:text-primary"
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
            onClick={handleLogout}
            className={cn(
              "w-full transition-colors duration-200 ease-spring",
              "text-destructive hover:text-destructive/90 hover:bg-destructive/10",
              isCollapsed ? "justify-center p-3" : "justify-start space-x-3 p-3"
            )}
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