import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TeethArch } from "@/components/clinic/TeethArch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  arch: z.string().min(1, "Arch selection is required"),
  screwType: z.string().min(1, "Screw type is required"),
  vdoDetails: z.string().min(1, "VDO details are required"),
  dueDate: z.string().min(1, "Due date is required"),
  specificInstructions: z.string().optional(),
});

export default function SurgicalDayApplianceForm() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      arch: "",
      screwType: "",
      vdoDetails: "",
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
        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b">
          <Button
            variant="ghost"
            onClick={() => navigate("/clinic/addnewlabscript")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">Surgical Day Appliance</h2>
        </div>

        {/* Main Content */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Left side - Teeth Arch */}
            <div>
              <TeethArch />
            </div>
            
            {/* Right side - Form */}
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="patientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter patient name" {...field} />
                        </FormControl>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select arch type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="upper">Upper</SelectItem>
                            <SelectItem value="lower">Lower</SelectItem>
                            <SelectItem value="both">Both</SelectItem>
                          </SelectContent>
                        </Select>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select screw type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="type1">Type 1</SelectItem>
                            <SelectItem value="type2">Type 2</SelectItem>
                            <SelectItem value="type3">Type 3</SelectItem>
                          </SelectContent>
                        </Select>
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
                          <Input placeholder="Enter VDO details" {...field} />
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
        </div>
      </div>
    </ClinicLayout>
  );
}