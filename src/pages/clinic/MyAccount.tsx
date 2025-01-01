import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { ClinicProfileForm } from "@/components/clinic/ClinicProfileForm";

export default function MyAccount() {
  return (
    <ClinicLayout>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Account</h1>
        </div>
        <ClinicProfileForm />
      </div>
    </ClinicLayout>
  );
}