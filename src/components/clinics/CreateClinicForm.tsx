import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Control } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { ClinicBasicInfoFields } from "./form/ClinicBasicInfoFields";
import { ClinicContactFields } from "./form/ClinicContactFields";
import { ContactInfo } from "@/components/clinic/ContactInfo";
import { clinicFormSchema, type CreateClinicFormValues } from "./types/clinic-form";
import type { Clinic } from "./types";

export function CreateClinicForm() {
  const queryClient = useQueryClient();
  
  const form = useForm<CreateClinicFormValues>({
    resolver: zodResolver(clinicFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      doctor_name: "",
      street_address: "",
      city: "",
      state: "",
      zip_code: "",
    },
  });

  async function onSubmit(values: CreateClinicFormValues) {
    try {
      console.log("Creating clinic with values:", values);
      
      const { data: existingClinic } = await supabase
        .from('clinics')
        .select('id')
        .eq('email', values.email)
        .maybeSingle();

      if (existingClinic) {
        toast.error("A clinic with this email already exists.");
        return;
      }

      console.log("Creating auth account for clinic");
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: 'Password123!', // Default password
        options: {
          data: {
            clinic_name: values.name,
          },
        }
      });

      if (authError) {
        console.error('Error creating auth account:', authError);
        toast.error("Failed to create clinic account. Please try again.");
        return;
      }

      if (!authData.user) {
        toast.error("Failed to create clinic account. Please try again.");
        return;
      }

      console.log("Auth account created, creating clinic record");

      // Construct the full address string
      const fullAddress = `${values.street_address}, ${values.city}, ${values.state} ${values.zip_code}`;

      const { error: clinicError } = await supabase.from('clinics').insert({
        name: values.name,
        email: values.email,
        phone: values.phone,
        doctor_name: values.doctor_name,
        address: fullAddress,
        street_address: values.street_address,
        city: values.city,
        state: values.state,
        zip_code: values.zip_code,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        auth_user_id: authData.user.id
      });

      if (clinicError) {
        console.error('Error creating clinic:', clinicError);
        toast.error("Failed to create clinic. Please try again.");
        return;
      }

      toast.success("Clinic created successfully!");
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
      form.reset();
    } catch (error) {
      console.error('Error creating clinic:', error);
      toast.error("Failed to create clinic. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ClinicBasicInfoFields form={form} />
          <ClinicContactFields form={form} />
        </div>

        <ContactInfo control={form.control as unknown as Control<Clinic>} />

        <Button 
          type="submit" 
          className="w-full h-11 bg-primary hover:bg-primary-hover transition-colors duration-200"
        >
          Create Clinic
        </Button>
      </form>
    </Form>
  );
}