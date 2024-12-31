import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Calendar,
  FileText,
  BarChart3,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    path: "/admin/dashboard",
  },
  {
    icon: Users,
    label: "Patient",
    path: "/admin/patients",
  },
  {
    icon: MessageSquare,
    label: "Message",
    path: "/admin/messages",
    badge: 120,
  },
  {
    icon: Calendar,
    label: "Appointment",
    path: "/admin/appointments",
  },
  {
    icon: FileText,
    label: "Medical Record",
    path: "/admin/records",
  },
  {
    icon: BarChart3,
    label: "Analytics",
    path: "/admin/analytics",
  },
  {
    icon: CreditCard,
    label: "Billing",
    path: "/admin/billing",
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/admin/settings",
  },
];

export const ClinicSidebarButtons = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col gap-2 px-4 h-full">
      <div className="flex-1">
        {sidebarButtons.map((button) => {
          const isActive = location.pathname === button.path;
          return (
            <Link
              key={button.label}
              to={button.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors relative group",
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              )}
            >
              <button.icon
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
                )}
              />
              <span className={cn(
                "font-medium",
                isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
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
      <Link
        to="/logout"
        className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-red-500 hover:text-red-600 group mb-4"
      >
        <LogOut className="h-5 w-5" />
        <span className="font-medium">Log out</span>
      </Link>
    </div>
  );
};