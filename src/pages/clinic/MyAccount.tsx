import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { ClinicProfileForm } from "@/components/clinic/ClinicProfileForm";
import { PasswordChangeForm } from "@/components/clinic/PasswordChangeForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClinicNavHeader } from "@/components/clinic/ClinicNavHeader";

export default function MyAccount() {
  return (
    <ClinicLayout>
      <div className="flex flex-col max-w-[1400px] w-full mx-auto h-screen py-8">
        <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
          <ClinicNavHeader />
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-8">
              <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-white via-white to-accent/5">
                <CardHeader className="border-b bg-accent/5 pb-6">
                  <CardTitle className="text-xl text-primary">Clinic Information</CardTitle>
                  <CardDescription>
                    Update your clinic's contact details and address information
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 pt-8">
                  <ClinicProfileForm />
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="overflow-hidden border-none shadow-md">
                  <CardHeader className="border-b bg-accent/5">
                    <CardTitle className="text-xl text-primary">Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security and password
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <PasswordChangeForm />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </ClinicLayout>
  );
}