import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClinicProfileForm } from "@/components/clinic/ClinicProfileForm";
import { Building2 } from "lucide-react";

export default function MyProfile() {
  return (
    <div className="space-y-6 p-6 pb-16">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">My Profile</h2>
          <p className="text-muted-foreground">
            Manage your clinic information and contact details
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Building2 className="h-8 w-8 text-muted-foreground" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clinic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ClinicProfileForm />
        </CardContent>
      </Card>
    </div>
  );
}