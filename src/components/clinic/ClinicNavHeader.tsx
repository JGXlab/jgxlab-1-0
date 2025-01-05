import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, LayoutDashboard, Users, FileText, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function ClinicNavHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="sticky top-0 w-full bg-white rounded-t-2xl px-6 py-3 flex items-center justify-between z-10">
      {/* Left side - Logo and nav items */}
      <div className="flex items-center space-x-6">
        <div className="flex flex-col">
          <span className="font-semibold text-base">JGX Digital Lab</span>
          <span className="text-xs text-muted-foreground">Clinic Portal</span>
        </div>
        
        <nav className="flex items-center space-x-3 border border-gray-200 rounded-full px-1.5 py-1">
          <button 
            onClick={() => navigate("/clinic/dashboard")}
            className={`flex items-center space-x-1.5 px-3 py-0 rounded-full transition-all duration-200 ${
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
            className={`flex items-center space-x-1.5 px-3 py-0 rounded-full transition-all duration-200 ${
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
            className={`flex items-center space-x-1.5 px-3 py-0 rounded-full transition-all duration-200 ${
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
            className={`flex items-center space-x-1.5 px-3 py-0 rounded-full transition-all duration-200 ${
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
        <button className="relative text-gray-500 hover:text-gray-700">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center">
            2
          </span>
        </button>
        <Avatar className="h-7 w-7">
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}