import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function SurgicalDayApplianceForm() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    toast({
      title: "Success",
      description: "Your design order has been submitted successfully.",
    });
  };

  return (
    <ClinicLayout>
      <div className="w-full">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/clinic/addnewlabscript")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Surgical Day Appliance Design Order</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name</Label>
                    <Input id="patientName" placeholder="Enter patient name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orderDate">Order Date</Label>
                    <Input id="orderDate" type="date" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specifications">Design Specifications</Label>
                  <textarea
                    id="specifications"
                    className="w-full min-h-[100px] p-3 rounded-md border"
                    placeholder="Enter detailed specifications for the appliance..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <textarea
                    id="additionalNotes"
                    className="w-full min-h-[100px] p-3 rounded-md border"
                    placeholder="Any additional notes or special requirements..."
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Submit Design Order
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </ClinicLayout>
  );
}