import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { PatientNameFields } from "./PatientNameFields";
import { PatientGenderField } from "./PatientGenderField";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { PatientDateOfBirthField } from "./PatientDateOfBirthField";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  gender: z.string({
    required_error: "Please select a gender.",
  }),
  dateOfBirth: z.date({
    required_error: "Please select a date of birth.",
  }),
});

export function CreatePatientForm({ onSuccess }: { onSuccess?: () => void }) {
  const queryClient = useQueryClient();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase.from('patients').insert({
        first_name: values.firstName,
        last_name: values.lastName,
        gender: values.gender,
        date_of_birth: values.dateOfBirth.toISOString().split('T')[0],
        user_id: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) throw error;

      toast.success("Patient created successfully!");
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error creating patient:', error);
      toast.error("Failed to create patient. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PatientNameFields form={form} />
        <PatientGenderField form={form} />
        <PatientDateOfBirthField form={form} />

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary-hover text-white"
        >
          Create Patient
        </Button>
      </form>
    </Form>
  );
}