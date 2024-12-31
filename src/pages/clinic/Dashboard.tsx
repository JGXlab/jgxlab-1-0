import { ClinicDashboard } from "@/components/clinic/ClinicDashboard";
import { ClinicSidebar } from "@/components/clinic/ClinicSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ClinicSidebar />
        <main className="flex-1">
          <div className="p-4">
            <SidebarTrigger className="mb-4" />
            <ClinicDashboard />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;