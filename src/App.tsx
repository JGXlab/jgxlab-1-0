import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import Register from "./pages/Register";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import Notifications from "./pages/admin/Notifications";
import Clinics from "./pages/admin/Clinics";
import AdminPatients from "./pages/admin/Patients";
import LabScripts from "./pages/admin/LabScripts";
import Settings from "./pages/admin/Settings";

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
              <Route path="/register" element={<Register />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/notifications" element={<Notifications />} />
              <Route path="/admin/clinics" element={<Clinics />} />
              <Route path="/admin/patients" element={<AdminPatients />} />
              <Route path="/admin/lab-scripts" element={<LabScripts />} />
              <Route path="/admin/settings" element={<Settings />} />
            </Routes>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;