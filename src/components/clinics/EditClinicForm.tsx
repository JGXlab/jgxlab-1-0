import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { EditClinicBasicInfo } from "./form/EditClinicBasicInfo";
import { EditClinicAddress } from "./form/EditClinicAddress";
import { editClinicFormSchema, type EditClinicFormValues } from "./types/edit-clinic-form";
import type { Clinic } from "./types";

interface EditClinicFormProps {
  clinic: Clinic;
}

export function EditClinicForm({ clinic }: EditClinicFormProps) {
  const queryClient = useQueryClient();
  
  // Split the address into components
  const addressParts = clinic.address?.split(',').map(part => part.trim()) || ['', '', ''];
  const stateZip = addressParts[2]?.split(' ') || ['', ''];
  
  const form = useForm<EditClinicFormValues>({
    resolver: zodResolver(editClinicFormSchema),
    defaultValues: {
      name: clinic.name,
      email: clinic.email,
      phone: clinic.phone,
      doctorName: clinic.doctor_name,
      street_address: addressParts[0] || '',
      city: addressParts[1] || '',
      state: stateZip[0] || '',
      zip_code: stateZip[1] || '',
    },
  });

  async function onSubmit(values: EditClinicFormValues) {
    try {
      console.log("Updating clinic with values:", values);

      // Combine address components
      const formattedAddress = `${values.street_address}, ${values.city}, ${values.state} ${values.zip_code}`;

      const { error: clinicError } = await supabase
        .from('clinics')
        .update({
          name: values.name,
          email: values.email,
          phone: values.phone,
          doctor_name: values.doctorName,
          address: formattedAddress,
          street_address: values.street_address,
          city: values.city,
          state: values.state,
          zip_code: values.zip_code,
        })
        .eq('id', clinic.id);

      if (clinicError) throw clinicError;

      toast.success("Clinic updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['clinics'] });
    } catch (error) {
      console.error('Error updating clinic:', error);
      toast.error("Failed to update clinic. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <EditClinicBasicInfo form={form} />
        <EditClinicAddress form={form} />

        <Button 
          type="submit" 
          className="w-full h-11 bg-primary hover:bg-primary-hover transition-colors duration-200"
        >
          Update Clinic
        </Button>
      </form>
    </Form>
  );
}