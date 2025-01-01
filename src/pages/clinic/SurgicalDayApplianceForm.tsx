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
import { PriceTableDropdown } from "@/components/surgical-form/PriceTableDropdown";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
  };

  return (
    <ClinicLayout>
      <div className="min-h-screen bg-gray-50/50">
        <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
          <div className="container flex items-center justify-between h-16 px-4 mx-auto">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/clinic/addnewlabscript")}
                className="rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-xl font-semibold">Surgical Day Appliance</h2>
            </div>
            <PriceTableDropdown />
          </div>
        </div>

        <div className="container px-4 py-8 mx-auto">
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <h3 className="text-lg font-medium">Create New Surgical Day Appliance</h3>
              <p className="text-sm text-muted-foreground">
                Fill in the details below to create a new surgical day appliance order.
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="patientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Patient Information</FormLabel>
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
                        <FormLabel className="text-base">Arch Selection</FormLabel>
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
                        <FormLabel className="text-base">Screw Type</FormLabel>
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
                        <FormLabel className="text-base">VDO Details</FormLabel>
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
                        <FormLabel className="text-base">Due Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="max-w-xs" />
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
                        <FormLabel className="text-base">Specific Instructions</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter any specific instructions or notes"
                            className="min-h-[100px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4">
                    <Button type="submit" className="w-full">
                      Pay and Complete
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ClinicLayout>
  );
}