import { ClinicSidebar } from "@/components/clinic/ClinicSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const NewLabRequest = () => {
  return (
    <div className="flex h-screen w-full">
      <ClinicSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="container py-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">New Lab Request</h1>
            <p className="mt-2 text-muted">Create a new laboratory test request</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-primary" />
                Create New Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted mb-6">
                Fill out the form below to submit a new laboratory test request.
              </p>
              
              {/* Form will be implemented in the next iteration */}
              <Button className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewLabRequest;