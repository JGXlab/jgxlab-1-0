import { Card } from "@/components/ui/card";

export const ClinicDashboard = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">12th Oct 2023</p>
        </div>
      </div>
      <Card className="p-6">
        <p className="text-gray-500">Dashboard content coming soon...</p>
      </Card>
    </div>
  );
};