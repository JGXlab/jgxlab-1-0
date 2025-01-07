import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClinicNavHeader } from "@/components/clinic/ClinicNavHeader";
import { PasswordChangeForm } from "@/components/clinic/PasswordChangeForm";

export default function Settings() {
  return (
    <ClinicLayout>
      <div className="flex flex-col max-w-[1400px] w-full mx-auto h-screen py-8">
        <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
          <ClinicNavHeader />
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Configure your application settings
                  </p>
                </div>
              </div>

              <div className="max-w-xl">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
                <PasswordChangeForm />
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </ClinicLayout>
  );
}