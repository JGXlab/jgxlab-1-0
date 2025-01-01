import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SurgicalDayApplianceForm() {
  const navigate = useNavigate();

  return (
    <ClinicLayout>
      <div className="bg-white rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b">
          <Button
            variant="ghost"
            onClick={() => navigate("/clinic/addnewlabscript")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">Surgical Day Appliance</h2>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="space-y-8">
            {/* Content will be added here */}
          </div>
        </div>
      </div>
    </ClinicLayout>
  );
}