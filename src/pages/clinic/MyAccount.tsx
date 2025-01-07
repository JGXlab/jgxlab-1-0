import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { ClinicProfileForm } from "@/components/clinic/ClinicProfileForm";
import { PasswordChangeForm } from "@/components/clinic/PasswordChangeForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClinicNavHeader } from "@/components/clinic/ClinicNavHeader";
import { UserCircle2 } from "lucide-react";

export default function MyAccount() {
  return (
    <ClinicLayout>
      <div className="flex flex-col max-w-[1400px] w-full mx-auto h-screen py-8">
        <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
          <ClinicNavHeader />
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <UserCircle2 className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                  <p className="text-sm text-muted-foreground">
                    Manage your clinic profile and preferences
                  </p>
                </div>
              </div>

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