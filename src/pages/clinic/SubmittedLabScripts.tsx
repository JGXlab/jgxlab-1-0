import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SubmittedLabScripts() {
  const navigate = useNavigate();

  return (
    <ClinicLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Lab Scripts</h1>
          <Button onClick={() => navigate("/clinic/new-lab-script")}>
            <FilePlus className="mr-2" />
            New Lab Script
          </Button>
        </div>
        {/* Submitted scripts list will be added later */}
      </div>
    </ClinicLayout>
  );
}