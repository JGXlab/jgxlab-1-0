"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  first_name: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  last_name: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
});

type DesignerFormValues = z.infer<typeof formSchema>;

export function CreateDesignerForm({ onSuccess }: { onSuccess: () => void }) {
  const queryClient = useQueryClient();

  const form = useForm<DesignerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit(values: DesignerFormValues) {
    try {
      console.log("Creating designer with values:", values);
      
      // First check if a designer exists in auth system
      const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
      const existingUser = users?.find(user => user.email === values.email);
      
      if (existingUser) {
        toast.error("A user with this email already exists.");
        return;
      }

      // Then check if a designer with this email already exists in our table
      const { data: existingDesigner } = await supabase
        .from('designers')
        .select('id')
        .eq('email', values.email)
        .maybeSingle();

      if (existingDesigner) {
        toast.error("A designer with this email already exists.");
        return;
      }

      // Create auth account for the designer
      console.log("Creating auth account for designer");
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: 'Password123!', // Default password
        options: {
          data: {
            first_name: values.first_name,
            last_name: values.last_name,
            role: 'designer',
          },
        }
      });

      if (authError) {
        console.error('Error creating auth account:', authError);
        toast.error("Failed to create designer account. Please try again.");
        return;
      }

      if (!authData.user) {
        toast.error("Failed to create designer account. Please try again.");
        return;
      }

      console.log("Auth account created, creating designer record");

      // Create designer in database
      const { error: designerError } = await supabase.from('designers').insert({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone: values.phone,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        auth_user_id: authData.user.id
      });

      if (designerError) {
        console.error('Error creating designer:', designerError);
        toast.error("Failed to create designer. Please try again.");
        return;
      }

      toast.success("Designer created successfully!");
      queryClient.invalidateQueries({ queryKey: ['designers'] });
      form.reset();
      onSuccess();
    } catch (error) {
      console.error('Error creating designer:', error);
      toast.error("Failed to create designer. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@example.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="+1 (555) 000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Create Designer
        </Button>
      </form>
    </Form>
  );
}