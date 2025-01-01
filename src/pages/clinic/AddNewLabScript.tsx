import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { ProductCard } from "@/components/lab-scripts/ProductCard";

export default function AddNewLabScript() {
  return (
    <ClinicLayout>
      <div className="w-full">
        <div className="space-y-8">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900">Add New Lab Script</h1>
            <p className="mt-2 text-sm text-gray-600">
              Select a design type to create a new lab script
            </p>
          </div>

          <div className="pl-4">
            <ProductCard
              title="Surgical Day Appliance"
              description="Custom-designed surgical appliances for optimal patient comfort and functionality"
              imagePath="https://images.unsplash.com/photo-1609840114035-3c981b782dfe?q=80&w=1000&auto=format&fit=crop"
            />
          </div>
        </div>
      </div>
    </ClinicLayout>
  );
}