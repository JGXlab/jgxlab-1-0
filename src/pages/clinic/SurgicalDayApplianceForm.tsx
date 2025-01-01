import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PatientSelector } from "@/components/patients/PatientSelector";
import { ArchSelector } from "@/components/surgical-form/ArchSelector";
import { ScrewTypeSelector } from "@/components/surgical-form/ScrewTypeSelector";
import { VDODetailsSelector } from "@/components/surgical-form/VDODetailsSelector";

const formSchema = z.object({
  patientId: z.string().min(1, "Patient selection is required"),
  arch: z.array(z.string()).min(1, "At least one arch must be selected"),
  screwType: z.array(z.string()).min(1, "At least one screw type must be selected"),
  vdoDetails: z.array(z.string()).min(1, "At least one VDO detail must be selected"),
  dueDate: z.string().min(1, "Due date is required"),
  specificInstructions: z.string().optional(),
});

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
    // Payment and submission logic will be added here
  };

  return (
    <ClinicLayout>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-4 p-6 border-b">
          <Button
            variant="ghost"
            onClick={() => navigate("/clinic/addnewlabscript")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">Surgical Day Appliance</h2>
        </div>

        <div className="p-6 max-w-3xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Patient</FormLabel>
                    <PatientSelector value={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="arch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arch</FormLabel>
                    <FormControl>
                      <ArchSelector value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="screwType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Screw Type</FormLabel>
                    <FormControl>
                      <ScrewTypeSelector value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vdoDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VDO Details</FormLabel>
                    <FormControl>
                      <VDODetailsSelector value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specificInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specific Instructions</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter any specific instructions or notes"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Pay and Complete
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </ClinicLayout>
  );
}