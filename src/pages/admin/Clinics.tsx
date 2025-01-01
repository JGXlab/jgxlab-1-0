import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Building2, Search, Bell, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreateClinicForm } from "@/components/admin/CreateClinicForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Profile = Tables<"profiles">;

const Clinics = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const { data: clinics, isLoading, refetch } = useQuery({
    queryKey: ["clinics"],
    queryFn: async () => {
      console.log("Fetching clinic profiles...");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_admin", false);

      if (error) {
        console.error("Error fetching clinics:", error);
        throw error;
      }

      console.log("Fetched clinics:", data);
      return data as Profile[];
    },
  });

  const handleSuccess = async () => {
    setIsOpen(false);
    await refetch();
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Clinics</h1>
        <div className="flex items-center gap-4">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Clinic
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Clinic</DialogTitle>
              </DialogHeader>
              <CreateClinicForm onSuccess={handleSuccess} />
            </DialogContent>
          </Dialog>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search clinics..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="p-2 relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <img src="/placeholder.svg" alt="Profile" className="w-10 h-10 rounded-full" />
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg">
          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
          All Clinics
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600">
          Active
        </button>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600">
          Archived
        </button>
      </div>

      <Card className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-gray-500">Loading clinics...</p>
          </div>
        ) : !clinics || clinics.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-gray-400">
            <div className="text-center">
              <Building2 className="w-12 h-12 mx-auto mb-4" />
              <p>No clinics added yet</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Created At</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {clinics.map((clinic) => (
                  <tr key={clinic.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{clinic.email}</td>
                    <td className="py-3 px-4">
                      {new Date(clinic.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AdminLayout>
  );
};

export default Clinics;