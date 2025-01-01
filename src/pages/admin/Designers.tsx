import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Bell, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateDesignerForm } from "@/components/designers/CreateDesignerForm";
import { DesignersTable } from "@/components/designers/DesignersTable";
import { useState } from "react";

const Designers = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Designers</h1>
        <div className="flex items-center gap-3">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add Designer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Designer</DialogTitle>
              </DialogHeader>
              <CreateDesignerForm onSuccess={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search designers..."
              className="pl-8 pr-3 py-1.5 rounded-lg border border-gray-200 w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <button className="p-1.5 relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <img src="/placeholder.svg" alt="Profile" className="w-8 h-8 rounded-full" />
        </div>
      </div>

      <Card className="p-4">
        <DesignersTable />
      </Card>
    </AdminLayout>
  );
};

export default Designers;