import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  PlusCircle,
  ClipboardList,
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
    title: "Patients",
    icon: Users,
    path: "/clinic/patients",
  },
  {
    title: "Add Lab Request",
    icon: PlusCircle,
    path: "/clinic/lab-request/new",
  },
  {
    title: "My Orders",
    icon: ClipboardList,
    path: "/clinic/orders",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/clinic/settings",
  },
];

export const ClinicSidebar = () => {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-gray-100 bg-white">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-center">
          <Link 
            to="/clinic/dashboard" 
            className="group flex flex-col items-center transition-all duration-300 hover:scale-105"
          >
            <span className="text-3xl font-bold text-primary">JGX</span>
            <span className="text-sm text-muted block text-center transition-colors group-hover:text-primary">
              Design Lab
            </span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={`group relative w-full transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <Link to={item.path} className="flex items-center gap-3 px-4 py-2">
                    <item.icon 
                      className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? "text-white" : "text-gray-500 group-hover:text-primary"
                      }`} 
                    />
                    <span className={`font-medium ${
                      isActive ? "text-white" : "text-gray-700 group-hover:text-primary"
                    }`}>
                      {item.title}
                    </span>
                    {isActive && (
                      <div className="absolute inset-y-0 left-0 w-1 bg-white rounded-r-full" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto p-4">
        <SidebarMenuButton
          asChild
          className="group w-full justify-start transition-all duration-200 hover:bg-red-50"
        >
          <Link to="/logout" className="flex items-center gap-3 px-4 py-2">
            <LogOut className="h-5 w-5 text-gray-500 transition-transform duration-200 group-hover:scale-110 group-hover:text-red-500" />
            <span className="font-medium text-gray-700 group-hover:text-red-500">Log Out</span>
          </Link>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};