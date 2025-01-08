import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { ClinicBasicInfoFields } from "./form/ClinicBasicInfoFields";
import { ClinicContactFields } from "./form/ClinicContactFields";
import { clinicFormSchema, type CreateClinicFormValues } from "./types/clinic-form";

export function CreateClinicForm() {
  const queryClient = useQueryClient();
  
  const form = useForm<CreateClinicFormValues>({
    resolver: zodResolver(clinicFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      doctorName: "",
      contactPerson: "",
      contactPhone: "",
      address: "",
    },
  });

  async function onSubmit(values: CreateClinicFormValues) {
    try {
      console.log("Creating clinic with values:", values);
      
      // First check if a clinic with this email already exists
      const { data: existingClinic } = await supabase
        .from('clinics')
        .select('id')
        .eq('email', values.email)
        .maybeSingle();

      if (existingClinic) {
        toast.error("A clinic with this email already exists.");
        return;
      }

      // Create auth account for the clinic
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

      // Create clinic in database
      const { error: clinicError } = await supabase.from('clinics').insert({
        name: values.name,
        email: values.email,
        phone: values.phone,
        doctor_name: values.doctorName,
        contact_person: values.contactPerson,
        contact_phone: values.contactPhone,
        address: values.address,
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

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Address</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter clinic address" 
                  {...field}
                  className="h-11 bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

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