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
});

type PatientFormValues = z.infer<typeof formSchema>;

interface EditPatientFormProps {
  patient: {
    id: string;
    first_name: string;
    last_name: string;
    gender: string;
  };
  onSuccess: () => void;
}

export function EditPatientForm({ patient, onSuccess }: EditPatientFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: patient.first_name,
      last_name: patient.last_name,
      gender: patient.gender as "male" | "female" | "other",
    },
  });

  async function onSubmit(values: PatientFormValues) {
    console.log("Submitting form with values:", values);
    try {
      const { error } = await supabase
        .from("patients")
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          gender: values.gender,
        })
        .eq("id", patient.id);

      if (error) throw error;

      console.log("Patient updated successfully");
      toast({
        title: "Success",
        description: "Patient updated successfully",
      });
      
      await queryClient.invalidateQueries({ queryKey: ["patients"] });
      onSuccess();
    } catch (error) {
      console.error("Error updating patient:", error);
      toast({
        title: "Error",
        description: "Failed to update patient",
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
          Update Patient
        </Button>
      </form>
    </Form>
  );
}