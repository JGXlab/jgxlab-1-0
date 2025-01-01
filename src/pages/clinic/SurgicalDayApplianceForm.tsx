import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PatientSelector } from "@/components/patients/PatientSelector";
import { ArchSelector } from "@/components/surgical-form/ArchSelector";
import { ScrewTypeSelector } from "@/components/surgical-form/ScrewTypeSelector";
import { VDODetailsSelector } from "@/components/surgical-form/VDODetailsSelector";
import { PriceTableDropdown } from "@/components/surgical-form/PriceTableDropdown";
import { FormSection } from "@/components/surgical-form/FormSection";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  patientId: z.string().min(1, "Patient selection is required"),
  arch: z.array(z.string()).min(1, "At least one arch must be selected"),
  screwType: z.array(z.string()).min(1, "At least one screw type must be selected"),
  vdoDetails: z.array(z.string()).min(1, "At least one VDO detail must be selected"),
  dueDate: z.string().min(1, "Due date is required"),
  specificInstructions: z.string().optional(),
});

const steps = [
  { id: 1, name: "Patient Details" },
  { id: 2, name: "Appliance Details" },
  { id: 3, name: "Additional Info" }
];

export default function SurgicalDayApplianceForm() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      arch: [],
      screwType: [],
      vdoDetails: [],
      dueDate: "",
      specificInstructions: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", values);
  };

  return (
    <ClinicLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/clinic/addnewlabscript")}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">Surgical Day Appliance</h1>
                  <p className="text-sm text-gray-500">Create a new surgical day appliance request</p>
                </div>
              </div>
              <PriceTableDropdown />
            </div>

            {/* Progress Steps */}
            <div className="py-4 flex items-center justify-center gap-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  {index > 0 && (
                    <div className="h-0.5 w-16 bg-gray-200 mx-2" />
                  )}
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm",
                      step.id === 1 ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
                    )}>
                      {step.id === 1 ? <Check className="h-4 w-4" /> : step.id}
                    </div>
                    <span className={cn(
                      "text-sm",
                      step.id === 1 ? "text-primary font-medium" : "text-gray-500"
                    )}>
                      {step.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormSection title="Patient Information">
                  <FormField
                    control={form.control}
                    name="patientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient</FormLabel>
                        <PatientSelector value={field.value} onChange={field.onChange} />
                      </FormItem>
                    )}
                  />
                </FormSection>

                <FormSection title="Appliance Details" className="pt-6 border-t">
                  <FormField
                    control={form.control}
                    name="arch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Arch Type</FormLabel>
                        <ArchSelector value={field.value} onChange={field.onChange} />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="screwType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Screw Type</FormLabel>
                        <ScrewTypeSelector value={field.value} onChange={field.onChange} />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vdoDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>VDO Details</FormLabel>
                        <VDODetailsSelector value={field.value} onChange={field.onChange} />
                      </FormItem>
                    )}
                  />
                </FormSection>

                <FormSection title="Additional Information" className="pt-6 border-t">
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <Input type="date" className="max-w-xs" {...field} />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="specificInstructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specific Instructions</FormLabel>
                        <Textarea 
                          placeholder="Enter any specific instructions or notes"
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormItem>
                    )}
                  />
                </FormSection>

                <div className="pt-6 border-t">
                  <Button type="submit" className="w-full">
                    Pay and Complete
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </ClinicLayout>
  );
}