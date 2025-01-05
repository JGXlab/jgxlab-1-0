import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClinicNavHeader } from "@/components/clinic/ClinicNavHeader";
import { Card } from "@/components/ui/card";
import { Settings2 } from "lucide-react";
import { useState } from "react";
import { LabScriptsPageHeader } from "@/components/lab-scripts/LabScriptsPageHeader";

export default function Settings() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock status counts for settings (you can modify these based on your needs)
  const statusCounts = {
    new: 2,
    inProcess: 3,
    paused: 1,
    onHold: 0,
    incomplete: 4,
    completed: 5,
    all: 15,
  };

  return (
    <ClinicLayout>
      <div className="flex flex-col max-w-[1400px] w-full mx-auto h-screen py-8">
        <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
          <ClinicNavHeader />
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <LabScriptsPageHeader
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onNewLabScript={() => console.log('Add new setting clicked')}
              statusCounts={statusCounts}
              selectedStatus={null}
              onStatusSelect={() => {}}
            />

            <Card className="bg-gradient-to-br from-white to-accent/30 border-none shadow-lg p-6">
              <div className="flex items-center justify-center h-40 text-gray-400">
                <div className="text-center">
                  <Settings2 className="w-12 h-12 mx-auto mb-4 text-primary/60" />
                  <p className="text-muted-foreground">Settings page under construction</p>
                </div>
              </div>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </ClinicLayout>
  );
}