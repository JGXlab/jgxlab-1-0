import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { PatientNameFields } from "./PatientNameFields";
import { PatientGenderField } from "./PatientGenderField";

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
});

export function CreatePatientForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Patient created successfully!");
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PatientNameFields form={form} />
        <PatientGenderField form={form} />

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