import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { ClinicProfileForm } from "@/components/clinic/ClinicProfileForm";
import { Card } from "@/components/ui/card";

export default function MyAccount() {
  return (
    <ClinicLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        <Card className="p-6 shadow-sm border-gray-100">
          <ClinicProfileForm />
        </Card>
      </div>
    </ClinicLayout>
  );
}