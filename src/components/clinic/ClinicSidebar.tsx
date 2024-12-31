import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  FolderClosed,
  ArrowLeftRight,
  Users,
  LineChart,
  FileText,
  Settings,
  HelpCircle,
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
    active: true,
  },
  {
    title: "Projects",
    icon: FolderClosed,
    path: "/clinic/projects",
  },
  {
    title: "Transaction",
    icon: ArrowLeftRight,
    path: "/clinic/transactions",
  },
  {
    title: "My Team",
    icon: Users,
    path: "/clinic/team",
  },
  {
    title: "Research Data",
    icon: LineChart,
    path: "/clinic/research",
  },
  {
    title: "Reports",
    icon: FileText,
    path: "/clinic/reports",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/clinic/settings",
  },
  {
    title: "Help",
    icon: HelpCircle,
    path: "/clinic/help",
  },
];

export const ClinicSidebar = () => {
  return (
    <Sidebar className="border-r border-gray-100">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-center">
          <Link to="/clinic/dashboard" className="text-2xl font-bold text-primary">
            <span className="text-3xl">JGX</span>
            <span className="text-sm text-muted block text-center">Healthcare Solutions</span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={`transition-all duration-300 ${
                  item.active
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <Link to={item.path} className="flex items-center gap-3 px-4 py-2">
                  <item.icon className={`h-5 w-5 ${item.active ? "text-white" : "text-gray-500"}`} />
                  <span className={item.active ? "text-white" : "text-gray-700"}>
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenuButton
          asChild
          className="w-full justify-start hover:bg-gray-50"
        >
          <Link to="/logout" className="flex items-center gap-3 px-4 py-2 text-gray-700">
            <LogOut className="h-5 w-5 text-gray-500" />
            <span>Log Out</span>
          </Link>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
};