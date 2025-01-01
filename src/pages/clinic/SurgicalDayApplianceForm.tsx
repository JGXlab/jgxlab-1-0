import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreatePatientForm } from "@/components/patients/CreatePatientForm";

const formSchema = z.object({
  patientId: z.string().min(1, "Patient selection is required"),
  arch: z.string().min(1, "Arch selection is required"),
  screwType: z.string().min(1, "Screw type is required"),
  vdoDetails: z.string().min(1, "VDO details are required"),
  dueDate: z.string().min(1, "Due date is required"),
  specificInstructions: z.string().optional(),
});

export default function SurgicalDayApplianceForm() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [createPatientOpen, setCreatePatientOpen] = useState(false);

  const { data: patients, isLoading: patientsLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      console.log('Fetching patients...');
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientId: "",
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
                    <div className="flex gap-2">
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="justify-between w-full"
                            >
                              {field.value
                                ? patients?.find((patient) => patient.id === field.value)
                                  ? `${patients.find((patient) => patient.id === field.value)?.first_name} ${
                                      patients?.find((patient) => patient.id === field.value)?.last_name
                                    }`
                                : "Select patient"
                                : "Select patient"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[400px] p-0">
                          <Command>
                            <CommandInput placeholder="Search patients..." />
                            <CommandEmpty>
                              No patient found.
                              <Button
                                type="button"
                                variant="link"
                                className="mt-2"
                                onClick={() => {
                                  setOpen(false);
                                  setCreatePatientOpen(true);
                                }}
                              >
                                Create new patient
                              </Button>
                            </CommandEmpty>
                            <CommandGroup>
                              {patients?.map((patient) => (
                                <CommandItem
                                  key={patient.id}
                                  value={patient.id}
                                  onSelect={() => {
                                    form.setValue("patientId", patient.id);
                                    setOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === patient.id ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {patient.first_name} {patient.last_name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <Dialog open={createPatientOpen} onOpenChange={setCreatePatientOpen}>
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline">
                            New Patient
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create New Patient</DialogTitle>
                          </DialogHeader>
                          <CreatePatientForm onSuccess={() => setCreatePatientOpen(false)} />
                        </DialogContent>
                      </Dialog>
                    </div>
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
    </ClinicLayout>
  );
}
