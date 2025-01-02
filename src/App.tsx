import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ClinicGuard } from "@/components/clinic/ClinicGuard";
import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/admin/login" element={<LoginForm />} />
            <Route
              path="/admin/*"
              element={
                <AdminGuard>
                  <AdminLayout>
                    <Routes>
                      <Route path="dashboard" element={<div>Admin Dashboard</div>} />
                      <Route path="patients" element={<div>Patients Management</div>} />
                      <Route path="clinics" element={<div>Clinics Management</div>} />
                      <Route path="designers" element={<div>Designers Management</div>} />
                      <Route path="notifications" element={<div>Notifications</div>} />
                      <Route path="lab-scripts" element={<div>Lab Scripts</div>} />
                      <Route path="settings" element={<div>Settings</div>} />
                    </Routes>
                  </AdminLayout>
                </AdminGuard>
              }
            />
            <Route
              path="/clinic/*"
              element={
                <ClinicGuard>
                  <ClinicLayout>
                    <Routes>
                      <Route path="dashboard" element={<div>Clinic Dashboard</div>} />
                      <Route path="patients" element={<div>Patient Management</div>} />
                      <Route path="submittedlabscripts" element={<div>Submitted Lab Scripts</div>} />
                      <Route path="pricing" element={<div>Pricing</div>} />
                      <Route path="myaccount" element={<div>My Account</div>} />
                    </Routes>
                  </ClinicLayout>
                </ClinicGuard>
              }
            />
          </Routes>
        </Router>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;