import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import type { Clinic } from "@/components/clinics/types";
import { BasicClinicInfo } from "./BasicClinicInfo";
import { ContactInfo } from "./ContactInfo";

export function ClinicProfileForm() {
  const form = useForm<Clinic>();

  const { data: clinic, isLoading } = useQuery({
    queryKey: ["clinic-profile"],
    queryFn: async () => {
      console.log("Fetching clinic profile...");
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("No authenticated user found");
        throw new Error("No authenticated user found");
      }

      console.log("Authenticated user ID:", user.id);
      
      const { data: clinicData, error: clinicError } = await supabase
        .from("clinics")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (clinicError) {
        console.error("Error fetching clinic:", clinicError);
        throw clinicError;
      }

      console.log("Raw clinic data response:", clinicData);

      if (!clinicData) {
        console.log("No clinic found for user:", user.id);
        return null;
      }

      // Split the address field into components if it exists
      const formattedClinicData = {
        ...clinicData,
        street_address: '',
        city: '',
        state: '',
        zip_code: ''
      };

      if (clinicData.address) {
        const addressParts = clinicData.address.split(',').map(part => part.trim());
        formattedClinicData.street_address = addressParts[0] || '';
        formattedClinicData.city = addressParts[1] || '';
        const stateZip = addressParts[2] ? addressParts[2].split(' ') : ['', ''];
        formattedClinicData.state = stateZip[0] || '';
        formattedClinicData.zip_code = stateZip[1] || '';
      }

      return formattedClinicData as Clinic;
    },
  });

  useEffect(() => {
    if (clinic) {
      console.log("Setting form values with clinic data:", clinic);
      form.reset(clinic);
    }
  }, [clinic, form]);

  const onSubmit = async (data: Clinic) => {
    try {
      console.log("Updating clinic with data:", data);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found");

      // Combine address fields for storage
      const formattedAddress = `${data.street_address}, ${data.city}, ${data.state} ${data.zip_code}`;

      const { error } = await supabase
        .from("clinics")
        .update({
          name: data.name,
          email: data.email,
          phone: data.phone,
          doctor_name: data.doctor_name,
          contact_person: data.contact_person,
          contact_phone: data.contact_phone,
          address: formattedAddress,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating clinic:", error);
      toast.error("Failed to update profile");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <BasicClinicInfo control={form.control} />
        <ContactInfo control={form.control} />
        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
}