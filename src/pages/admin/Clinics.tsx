import { AdminLayout } from "@/components/admin/AdminLayout";
import { CreateClinicDialog } from "@/components/clinics/CreateClinicDialog";

const Clinics = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Clinics</h1>
            <p className="text-muted-foreground">
              Manage your clinic locations and details
            </p>
          </div>
          <CreateClinicDialog />
        </div>
        
        {/* Placeholder for clinics list - to be implemented */}
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          Clinics management functionality will be implemented here
        </div>
      </div>
    </AdminLayout>
  );
};

export default Clinics;