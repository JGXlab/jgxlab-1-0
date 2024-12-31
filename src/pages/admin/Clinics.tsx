import { ClinicSidebar } from "@/components/clinic/ClinicSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";

const Clinics = () => {
  return (
    <div className="flex h-screen w-full">
      <ClinicSidebar />
      <div className="flex-1 p-8 bg-gray-50">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Clinics</h1>
          <p className="text-gray-500">Manage your clinics</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-40 text-gray-400">
              <div className="text-center">
                <Building2 className="w-12 h-12 mx-auto mb-4" />
                <p>No clinics added yet</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Clinics;