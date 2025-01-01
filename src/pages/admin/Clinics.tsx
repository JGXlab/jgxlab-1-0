import { AdminLayout } from "@/components/admin/AdminLayout";
import { CreateClinicDialog } from "@/components/clinics/CreateClinicDialog";
import { ClinicsTable } from "@/components/clinics/ClinicsTable";

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
        
        <ClinicsTable />
      </div>
    </AdminLayout>
  );
};

export default Clinics;