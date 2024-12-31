import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Calendar,
  FileText,
  BarChart3,
  Receipt,
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
    icon: Receipt,
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
    <div className="flex flex-col gap-1 px-2">
      {sidebarButtons.map((button) => {
        const isActive = location.pathname === button.path;
        return (
          <Link
            key={button.label}
            to={button.path}
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors relative group",
              isActive
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <button.icon
              className={cn(
                "h-5 w-5 transition-transform group-hover:scale-110",
                isActive ? "text-white" : "text-gray-500 group-hover:text-primary"
              )}
            />
            <span className="font-medium">{button.label}</span>
            {button.badge && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {button.badge}
              </span>
            )}
          </Link>
        );
      })}
      <Link
        to="/logout"
        className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors mt-auto text-gray-600 hover:bg-red-50 group"
      >
        <LogOut className="h-5 w-5 text-gray-500 transition-transform group-hover:scale-110 group-hover:text-red-500" />
        <span className="font-medium group-hover:text-red-500">Log out</span>
      </Link>
    </div>
  );
};