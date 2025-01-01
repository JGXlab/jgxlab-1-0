import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import type { Clinic } from "@/components/clinics/types";
import { ClinicFormFields } from "./ClinicFormFields";

export function ClinicProfileForm() {
  const queryClient = useQueryClient();
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
      
      // First check if there's already a clinic with this email
      const { data: existingClinicByEmail } = await supabase
        .from("clinics")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();

      if (existingClinicByEmail) {
        console.log("Found existing clinic by email:", existingClinicByEmail);
        // Update the clinic to associate it with this user if not already
        if (existingClinicByEmail.auth_user_id !== user.id) {
          const { error: updateError } = await supabase
            .from("clinics")
            .update({ auth_user_id: user.id })
            .eq("id", existingClinicByEmail.id);

          if (updateError) {
            console.error("Error updating clinic association:", updateError);
            throw updateError;
          }
        }
        return existingClinicByEmail as Clinic;
      }

      // If no clinic found by email, try to find by auth_user_id
      const { data: clinicData, error: clinicError } = await supabase
        .from("clinics")
        .select("*")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (clinicError) {
        console.error("Error fetching clinic:", clinicError);
        throw clinicError;
      }

      console.log("Raw clinic data response:", clinicData);

      if (!clinicData) {
        console.log("No clinic found for user:", user.id);
        
        // Get user profile to ensure we have the correct user_id
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (!profileData) {
          throw new Error("No profile found for user");
        }

        // Create a new clinic entry with both IDs
        const { data: newClinic, error: createError } = await supabase
          .from("clinics")
          .insert({
            name: "",
            email: user.email || "",
            phone: "",
            doctor_name: "",
            contact_person: "",
            contact_phone: "",
            address: "",
            auth_user_id: user.id,    // Auth user ID
            user_id: profileData.id    // Profile ID
          })
          .select()
          .single();

        if (createError) {
          console.error("Error creating clinic:", createError);
          throw createError;
        }

        return newClinic as Clinic;
      }

      return clinicData as Clinic;
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

      // Check if email is being changed and if it's already in use
      if (data.email !== clinic?.email) {
        const { data: existingClinic } = await supabase
          .from("clinics")
          .select("id")
          .eq("email", data.email)
          .neq("auth_user_id", user.id)
          .maybeSingle();

        if (existingClinic) {
          toast.error("This email is already in use by another clinic");
          return;
        }
      }

      const { error } = await supabase
        .from("clinics")
        .update({
          name: data.name,
          email: data.email,
          phone: data.phone,
          doctor_name: data.doctor_name,
          contact_person: data.contact_person,
          contact_phone: data.contact_phone,
          address: data.address,
        })
        .eq("auth_user_id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ['clinic-profile'] });
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
        <ClinicFormFields form={form} />
        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
}