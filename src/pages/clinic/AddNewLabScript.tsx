import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { ProductCard } from "@/components/lab-scripts/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddNewLabScript() {
  const navigate = useNavigate();

  return (
    <ClinicLayout>
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate(-1)}
            className="text-muted hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Add New Lab Script</h1>
            <p className="text-sm text-muted mt-1">
              Select a design type to create a new lab script for your patient
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          <ProductCard
            title="Full Arch Surgical Day Appliance"
            description="Custom-designed full arch surgical appliances for optimal patient comfort and functionality during surgical procedures"
            imagePath="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=1000&auto=format&fit=crop"
          />
        </div>
      </div>
    </ClinicLayout>
  );
}