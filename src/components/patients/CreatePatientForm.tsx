"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PatientNameFields } from "./PatientNameFields";
import { PatientGenderField } from "./PatientGenderField";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender.",
  }),
  clinic_id: z.string().min(1, {
    message: "Please select a clinic.",
  }),
});

type PatientFormValues = z.infer<typeof formSchema>;

export function CreatePatientForm({ onSuccess, clinicId }: { onSuccess: () => void; clinicId?: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      gender: undefined,
      clinic_id: clinicId || "",
    },
  });

  async function onSubmit(values: PatientFormValues) {
    console.log("Submitting form with values:", values);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const patientData = {
        first_name: values.first_name,
        last_name: values.last_name,
        gender: values.gender as string,
        user_id: userData.user.id,
        clinic_id: values.clinic_id,
      };

      console.log("Creating patient with data:", patientData);
      const { error } = await supabase.from("patients").insert(patientData);

      if (error) throw error;

      console.log("Patient created successfully");
      toast({
        title: "Success",
        description: "Patient created successfully",
      });
      
      await queryClient.invalidateQueries({ queryKey: ["patients"] });
      form.reset(); // Reset the form after successful submission
      onSuccess(); // Close the dialog
    } catch (error) {
      console.error("Error creating patient:", error);
      toast({
        title: "Error",
        description: "Failed to create patient",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PatientNameFields form={form} />
        <PatientGenderField form={form} />
        <Button type="submit" className="w-full">
          Create Patient
        </Button>
      </form>
    </Form>
  );
}