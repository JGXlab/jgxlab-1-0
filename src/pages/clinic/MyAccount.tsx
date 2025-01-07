import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { ClinicProfileForm } from "@/components/clinic/ClinicProfileForm";
import { PasswordChangeForm } from "@/components/clinic/PasswordChangeForm";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClinicNavHeader } from "@/components/clinic/ClinicNavHeader";

export default function MyAccount() {
  return (
    <ClinicLayout>
      <div className="flex flex-col max-w-[1400px] w-full mx-auto h-screen py-8">
        <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
          <ClinicNavHeader />
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage your clinic profile and preferences
                  </p>
                </div>
              </div>

              <Card className="bg-gradient-to-br from-white to-accent/30 border-none shadow-lg p-6">
                <ClinicProfileForm />
              </Card>

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Security Settings</h2>
                <PasswordChangeForm />
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </ClinicLayout>
  );
}