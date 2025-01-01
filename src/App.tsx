import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { ClinicGuard } from "@/components/clinic/ClinicGuard";
import { DesignGuard } from "@/components/design/DesignGuard";
import Index from "./pages/Index";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import Notifications from "./pages/admin/Notifications";
import AdminPatients from "./pages/admin/Patients";
import LabScripts from "./pages/admin/LabScripts";
import Settings from "./pages/admin/Settings";
import Clinics from "./pages/admin/Clinics";
import Designers from "./pages/admin/Designers";
import ClinicDashboard from "./pages/clinic/Dashboard";
import ClinicPatients from "./pages/clinic/Patients";
import NewLabScriptForm from "./pages/clinic/NewLabScriptForm";
import SubmittedLabScripts from "./pages/clinic/SubmittedLabScripts";
import MyAccount from "./pages/clinic/MyAccount";
import DesignLogin from "./pages/design/Login";
import DesignDashboard from "./pages/design/Dashboard";
import DesignLabScripts from "./pages/design/LabScripts";
import DesignSettings from "./pages/design/Settings";
import DesignMyProfile from "./pages/design/MyProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
              <Route path="/admin/notifications" element={<AdminGuard><Notifications /></AdminGuard>} />
              <Route path="/admin/patients" element={<AdminGuard><AdminPatients /></AdminGuard>} />
              <Route path="/admin/lab-scripts" element={<AdminGuard><LabScripts /></AdminGuard>} />
              <Route path="/admin/settings" element={<AdminGuard><Settings /></AdminGuard>} />
              <Route path="/admin/clinics" element={<AdminGuard><Clinics /></AdminGuard>} />
              <Route path="/admin/designers" element={<AdminGuard><Designers /></AdminGuard>} />
              
              {/* Clinic Routes */}
              <Route path="/clinic/dashboard" element={<ClinicGuard><ClinicDashboard /></ClinicGuard>} />
              <Route path="/clinic/patients" element={<ClinicGuard><ClinicPatients /></ClinicGuard>} />
              <Route path="/clinic/new-lab-script" element={<ClinicGuard><NewLabScriptForm /></ClinicGuard>} />
              <Route path="/clinic/submittedlabscripts" element={<ClinicGuard><SubmittedLabScripts /></ClinicGuard>} />
              <Route path="/clinic/myaccount" element={<ClinicGuard><MyAccount /></ClinicGuard>} />

              {/* Designer Routes */}
              <Route path="/design/login" element={<DesignLogin />} />
              <Route path="/design/dashboard" element={<DesignGuard><DesignDashboard /></DesignGuard>} />
              <Route path="/design/labscripts" element={<DesignGuard><DesignLabScripts /></DesignGuard>} />
              <Route path="/design/settings" element={<DesignGuard><DesignSettings /></DesignGuard>} />
              <Route path="/design/myprofile" element={<DesignGuard><DesignMyProfile /></DesignGuard>} />
            </Routes>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;