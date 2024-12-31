import { ClinicDashboard } from "@/components/clinic/ClinicDashboard";
import { ClinicSidebar } from "@/components/clinic/ClinicSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <ClinicSidebar />
        <main className="flex-1">
          <div className="p-4">
            <SidebarTrigger className="mb-4 transition-transform duration-300 hover:scale-110" />
            <ClinicDashboard />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;