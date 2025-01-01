import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, FilePlus, FileCheck, UserRound } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/clinic/dashboard", icon: LayoutDashboard },
  { name: "Patients", href: "/clinic/patients", icon: Users },
  { name: "Add New Lab Script", href: "/clinic/addnewlabscript", icon: FilePlus },
  { name: "Submitted Lab Scripts", href: "/clinic/submittedlabscripts", icon: FileCheck },
  { name: "My Account", href: "/clinic/myaccount", icon: UserRound },
];

export function ClinicSidebar() {
  const location = useLocation();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-semibold text-gray-800">Clinic Portal</h1>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  location.pathname === item.href
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-50",
                  "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                )}
              >
                <Icon
                  className={cn(
                    location.pathname === item.href
                      ? "text-white"
                      : "text-gray-400 group-hover:text-gray-500",
                    "mr-3 h-5 w-5 flex-shrink-0"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}