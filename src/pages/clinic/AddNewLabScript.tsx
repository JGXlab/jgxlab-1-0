import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { ProductCard } from "@/components/lab-scripts/ProductCard";

export default function AddNewLabScript() {
  return (
    <ClinicLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add New Lab Script</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard
            title="Surgical Day Appliance"
            description="Custom-designed surgical appliances for optimal patient comfort and functionality"
            imagePath="/placeholder.svg"
          />
          {/* More product cards can be added here */}
        </div>
      </div>
    </ClinicLayout>
  );
}