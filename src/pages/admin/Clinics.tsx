import { AdminLayout } from "@/components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Building2 } from "lucide-react";

const Clinics = () => {
  const { data: clinics, isLoading, error } = useQuery({
    queryKey: ['clinics'],
    queryFn: async () => {
      console.log("Fetching clinic profiles...");
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_admin', true);

      if (error) {
        console.error("Error fetching clinics:", error);
        throw error;
      }

      return data || [];
    }
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="text-red-500">
          Error loading clinics. Please try again later.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Clinics</h1>
      </div>

      {clinics && clinics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clinics.map((clinic) => (
            <Card key={clinic.id} className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">{clinic.email}</h3>
                  <p className="text-sm text-gray-500">Admin</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6">
          <div className="flex items-center justify-center h-40 text-gray-400">
            <div className="text-center">
              <Building2 className="w-12 h-12 mx-auto mb-4" />
              <p>No clinics found</p>
            </div>
          </div>
        </Card>
      )}
    </AdminLayout>
  );
};

export default Clinics;