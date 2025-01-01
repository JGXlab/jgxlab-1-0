import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Clinic
          </Button>
        </div>
        
        {/* Placeholder for clinics content - to be implemented */}
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          Clinics management functionality will be implemented here
        </div>
      </div>
    </AdminLayout>
  );
};

export default Clinics;