import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClinicNavHeader } from "@/components/clinic/ClinicNavHeader";
import { Card } from "@/components/ui/card";
import { Settings as SettingsIcon, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Settings() {
  return (
    <ClinicLayout>
      <div className="flex flex-col max-w-[1400px] w-full mx-auto h-screen py-8">
        <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
          <ClinicNavHeader />
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 min-w-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Configure your application settings
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-4 w-full lg:w-auto shrink-0">
                <div className="relative group flex-1 lg:flex-none min-w-0">
                  <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-gray-600 z-10" />
                  <input
                    type="text"
                    placeholder="Search settings..."
                    className="w-full lg:w-[200px] pl-8 sm:pl-10 pr-2 sm:pr-4 py-1.5 sm:py-2 text-sm rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white/50 backdrop-blur-sm transition-all duration-200 hover:bg-white"
                  />
                </div>
                <Button
                  className="whitespace-nowrap bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full px-3 sm:px-6 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2 transition-all duration-200 shadow-sm hover:shadow-md text-sm shrink-0"
                >
                  <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Add Setting
                </Button>
              </div>
            </div>

            {/* Content Section */}
            <Card className="bg-gradient-to-br from-white to-accent/30 border-none shadow-lg p-6">
              <div className="flex items-center justify-center h-40 text-gray-400">
                <div className="text-center">
                  <SettingsIcon className="w-12 h-12 mx-auto mb-4 text-primary/60" />
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