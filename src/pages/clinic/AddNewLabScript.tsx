import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { ProductCard } from "@/components/lab-scripts/ProductCard";

export default function AddNewLabScript() {
  return (
    <ClinicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-gray-900">Add New Lab Script</h1>
            <p className="mt-2 text-sm text-gray-600">
              Select a design type to create a new lab script
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            <ProductCard
              title="Surgical Day Appliance"
              description="Custom-designed surgical appliances for optimal patient comfort and functionality"
              imagePath="/placeholder.svg"
            />
            {/* More product cards can be added here */}
          </div>
        </div>
      </div>
    </ClinicLayout>
  );
}