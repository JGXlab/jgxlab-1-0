import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, LayoutDashboard, Users, FileText, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function ClinicNavHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to check if a path is active
  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="sticky top-0 w-full bg-white rounded-t-2xl px-8 py-4 flex items-center justify-between z-10">
      {/* Left side - Logo and nav items */}
      <div className="flex items-center space-x-8">
        <div className="flex flex-col">
          <span className="font-semibold text-lg">JGX Digital Lab</span>
          <span className="text-xs text-muted-foreground">Clinic Portal</span>
        </div>
        
        <nav className="flex items-center space-x-6">
          <button 
            onClick={() => navigate("/clinic/dashboard")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isActivePath("/clinic/dashboard") 
                ? "bg-primary text-white" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </button>
          
          <button 
            onClick={() => navigate("/clinic/patients")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isActivePath("/clinic/patients") 
                ? "bg-primary text-white" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Patients</span>
          </button>
          
          <button 
            onClick={() => navigate("/clinic/submittedlabscripts")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isActivePath("/clinic/submittedlabscripts") 
                ? "bg-primary text-white" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Lab Scripts</span>
          </button>
          
          <button 
            onClick={() => navigate("/clinic/myaccount")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isActivePath("/clinic/myaccount") 
                ? "bg-primary text-white" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      {/* Right side - notifications and profile */}
      <div className="flex items-center space-x-6">
        <button className="relative text-gray-500 hover:text-gray-700">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            2
          </span>
        </button>
        <Avatar className="h-8 w-8">
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}