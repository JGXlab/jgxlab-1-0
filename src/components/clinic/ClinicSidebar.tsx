import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, FileCheck, UserRound, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const sidebarButtons = [
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
    icon: FileCheck,
    label: "Lab Script",
    path: "/clinic/submittedlabscripts",
  },
  {
    icon: UserRound,
    label: "My Account",
    path: "/clinic/myaccount",
  },
];

export function ClinicSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      console.log("Clinic logging out...");
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your clinic account.",
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
    <div className="fixed left-0 top-0 flex flex-col w-64 h-screen bg-white border-r border-gray-100">
      <div className="flex items-center h-16 px-6 border-b border-gray-100">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-primary">JGX Digital Lab</h1>
          <span className="text-sm text-muted-foreground">Clinic Portal</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <div className="flex flex-col gap-1 px-3">
          {sidebarButtons.map((button) => {
            const isActive = location.pathname === button.path;
            return (
              <Link
                key={button.label}
                to={button.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative group",
                  isActive
                    ? "bg-accent text-primary shadow-sm"
                    : "text-secondary hover:bg-accent/50 hover:text-primary"
                )}
              >
                <button.icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-primary" : "text-secondary group-hover:text-primary"
                  )}
                />
                <span className="font-medium text-sm">{button.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="px-3 pb-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg transition-colors text-destructive hover:bg-destructive/10"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
};