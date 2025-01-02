import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { PriceTableDropdown } from "@/components/surgical-form/PriceTableDropdown";

const Pricing = () => {
  return (
    <ClinicLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Pricing</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="max-w-3xl mx-auto">
            <PriceTableDropdown />
          </div>
        </div>
      </div>
    </ClinicLayout>
  );
};

export default Pricing;