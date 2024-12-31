import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Calendar,
  FileText,
  BarChart2,
  Receipt,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/clinic/dashboard",
  },
  {
    title: "Patient",
    icon: Users,
    path: "/clinic/patients",
  },
  {
    title: "Message",
    icon: MessageSquare,
    path: "/clinic/messages",
    badge: "120",
  },
  {
    title: "Appointment",
    icon: Calendar,
    path: "/clinic/appointments",
  },
  {
    title: "Medical Record",
    icon: FileText,
    path: "/clinic/records",
  },
  {
    title: "Analytics",
    icon: BarChart2,
    path: "/clinic/analytics",
  },
  {
    title: "Billing",
    icon: Receipt,
    path: "/clinic/billing",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/clinic/settings",
  },
];

export const ClinicSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-primary">
            <span className="text-blue-600">Xenity</span>
            <span className="text-gray-900">health</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className="transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Link to={item.path} className="flex items-center gap-2">
                  <item.icon className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-200">
                    {item.title}
                  </span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenuButton
          asChild
          variant="outline"
          className="w-full justify-start transition-colors duration-300 hover:bg-red-50 hover:text-red-600"
        >
          <Link to="/logout" className="flex items-center gap-2 text-red-500">
            <LogOut className="h-5 w-5" />
            <span>Log out</span>
          </Link>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};