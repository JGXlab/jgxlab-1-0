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
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  patientId: z.string().min(1, "Patient selection is required"),
  arch: z.array(z.string()).min(1, "At least one arch must be selected"),
  screwType: z.array(z.string()).min(1, "At least one screw type must be selected"),
  vdoDetails: z.array(z.string()).min(1, "At least one VDO detail must be selected"),
  dueDate: z.string().min(1, "Due date is required"),
  specificInstructions: z.string().optional(),
});

const archOptions = [
  { id: "upper", label: "Upper" },
  { id: "lower", label: "Lower" },
  { id: "both", label: "Both" },
];

const screwTypeOptions = [
  { id: "type1", label: "Type 1" },
  { id: "type2", label: "Type 2" },
  { id: "type3", label: "Type 3" },
];

const vdoDetailsOptions = [
  { id: "detail1", label: "Detail 1" },
  { id: "detail2", label: "Detail 2" },
  { id: "detail3", label: "Detail 3" },
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
                render={() => (
                  <FormItem>
                    <FormLabel>Arch</FormLabel>
                    <div className="space-y-2">
                      {archOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="arch"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, option.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="screwType"
                render={() => (
                  <FormItem>
                    <FormLabel>Screw Type</FormLabel>
                    <div className="space-y-2">
                      {screwTypeOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="screwType"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, option.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vdoDetails"
                render={() => (
                  <FormItem>
                    <FormLabel>VDO Details</FormLabel>
                    <div className="space-y-2">
                      {vdoDetailsOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="vdoDetails"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={option.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, option.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {option.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
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