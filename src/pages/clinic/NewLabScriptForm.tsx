import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
import { FormSection } from "@/components/surgical-form/FormSection";
import { TreatmentTypeSelector } from "@/components/surgical-form/TreatmentTypeSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  patientId: z.string().min(1, "Patient selection is required"),
  applianceType: z.string().min(1, "Appliance type is required"),
  arch: z.string().min(1, "Arch type must be selected"),
  treatmentType: z.string().min(1, "Treatment type is required"),
  screwType: z.array(z.string()).min(1, "At least one screw type must be selected"),
  vdoDetails: z.array(z.string()).min(1, "At least one VDO detail must be selected"),
  dueDate: z.string().min(1, "Due date is required"),
  specificInstructions: z.string().optional(),
});

export default function NewLabScriptForm() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
      applianceType: "",
      arch: "",
      treatmentType: "",
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
        {/* Header */}
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
                  <h1 className="text-xl font-semibold text-gray-900">New Lab Script</h1>
                  <p className="text-sm text-gray-500">Create a new lab script request</p>
                </div>
              </div>
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
                    name="applianceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Appliance Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select appliance type" />
                          </SelectTrigger>
                          <SelectContent className="bg-white z-50">
                            <SelectItem value="surgical-day">Surgical Day Appliance</SelectItem>
                            <SelectItem value="printed-try-in">Printed Try-in</SelectItem>
                            <SelectItem value="nightguard">Nightguard</SelectItem>
                            <SelectItem value="direct-load-pmma">Direct Load PMMA</SelectItem>
                            <SelectItem value="direct-load-zirconia">Direct Load Zirconia</SelectItem>
                            <SelectItem value="ti-bar">Ti-bar and Super Structure</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

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
                    name="treatmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Treatment Type</FormLabel>
                        <TreatmentTypeSelector 
                          value={field.value} 
                          onChange={field.onChange}
                          selectedArch={[form.watch('arch')]}
                        />
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