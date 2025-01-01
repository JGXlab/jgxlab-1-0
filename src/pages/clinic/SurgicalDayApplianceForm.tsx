import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Clock, Send, X, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function SurgicalDayApplianceForm() {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <ClinicLayout>
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/clinic/addnewlabscript")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">Medical Record</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-2 gap-8">
          {/* Left Column - Tooth Diagram */}
          <div className="border rounded-lg p-6">
            <div className="flex gap-4 mb-6">
              <Button variant="secondary" className="rounded-full">Medical</Button>
              <Button variant="ghost" className="rounded-full">Cosmetic</Button>
            </div>
            
            {/* Tooth Chart */}
            <div className="relative w-full aspect-square">
              <img 
                src="/lovable-uploads/ef1abaac-2ec2-43f7-b02d-6c96a852d775.png" 
                alt="Tooth Diagram"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600">Has treatment before</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-gray-600">Pending Treatment</span>
              </div>
            </div>
          </div>

          {/* Right Column - Patient Information */}
          <div className="space-y-6">
            {/* Patient Header */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white">
                CS
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500">Patient name</div>
                <div className="text-lg font-semibold">Christopher Smallwood</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Change Status</span>
                <Button variant="outline" className="text-sm">
                  Registered
                </Button>
              </div>
            </div>

            {/* Treatment Info */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-sm text-gray-500">TREATMENT</div>
                <div className="font-medium">Tooth Filling</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">DATE AND TIME</div>
                <div className="font-medium">Fri, 16 May</div>
                <div className="text-sm text-gray-500">02:00-03:00 PM</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">DENTIST</div>
                <div className="font-medium">Putri Lestari</div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="flex items-center justify-between border-t border-b py-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-600">Payment</span>
                <span className="font-medium">Bill #10102</span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">UNPAID</span>
              </div>
              <Button variant="outline" className="text-yellow-500">
                <Send className="h-4 w-4 mr-2" />
                Send Reminder
              </Button>
            </div>

            {/* General Info */}
            <div>
              <h3 className="font-semibold mb-4">General info</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <div className="text-sm text-gray-500">FULL NAME</div>
                  <div className="font-medium">Christopher C. Smallwood</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">PHONE NUMBER</div>
                  <div className="font-medium">+1 (409)-832-3913</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">AGE</div>
                  <div className="font-medium">24</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">EMAIL</div>
                  <div className="font-medium">ChristopherW12@mail.com</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">GENDER</div>
                  <div className="font-medium">Male</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">ADDRESS</div>
                  <div className="font-medium">4337 Lynn Ogden Lane, Beaumont, TX 77701</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClinicLayout>
  );
}