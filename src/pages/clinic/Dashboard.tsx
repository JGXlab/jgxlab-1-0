import { ClinicDashboard } from "@/components/clinic/ClinicDashboard";
import { ClinicSidebar } from "@/components/clinic/ClinicSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <ClinicSidebar />
        <main className="flex-1">
          <ClinicDashboard />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;