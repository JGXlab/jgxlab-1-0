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
import { DialogClose } from "@/components/ui/dialog";
import { useRef } from "react";

export function CreateClinicForm() {
  const queryClient = useQueryClient();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  
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

      // Get current admin user
      const { data: { user: adminUser }, error: adminError } = await supabase.auth.getUser();
      
      if (adminError || !adminUser) {
        console.error('Error getting admin user:', adminError);
        toast.error("Admin session expired. Please log in again.");
        return;
      }

      // First create the clinic user using the admin API
      const { data: adminAuthData, error: adminAuthError } = await fetch('/api/admin/create-clinic-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          email: values.email,
          password: 'Password123!', // Default password
          clinicName: values.name,
        }),
      }).then(res => res.json());

      if (adminAuthError) {
        console.error('Error creating auth account:', adminAuthError);
        toast.error("Failed to create clinic account. Please try again.");
        return;
      }

      if (!adminAuthData?.user) {
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
        user_id: adminAuthData.user.id,
        auth_user_id: adminAuthData.user.id
      });

      if (clinicError) {
        console.error('Error creating clinic:', clinicError);
        toast.error("Failed to create clinic. Please try again.");
        return;
      }

      toast.success("Clinic created successfully!");
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
      form.reset();
      closeButtonRef.current?.click();
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

        <div className="flex justify-end space-x-4">
          <DialogClose ref={closeButtonRef} className="hidden" />
          <Button 
            type="submit" 
            className="w-full h-11 bg-primary hover:bg-primary-hover transition-colors duration-200"
          >
            Create Clinic
          </Button>
        </div>
      </form>
    </Form>
  );
}