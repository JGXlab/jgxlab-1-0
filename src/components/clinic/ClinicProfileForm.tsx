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
      
      // First try to find clinic by user_id
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
        // Check if email already exists before creating new clinic
        const { data: existingClinic } = await supabase
          .from("clinics")
          .select("id")
          .eq("email", user.email)
          .maybeSingle();

        if (existingClinic) {
          throw new Error("A clinic with this email already exists");
        }

        // Create a new clinic entry for this user
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
            user_id: user.id
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
          .neq("user_id", user.id)
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
        .eq("user_id", user.id);

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