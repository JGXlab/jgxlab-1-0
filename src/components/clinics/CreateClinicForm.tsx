import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Clinic name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  doctorName: z.string().min(2, {
    message: "Doctor name must be at least 2 characters.",
  }),
  contactPerson: z.string().min(2, {
    message: "Contact person name must be at least 2 characters.",
  }),
  contactPhone: z.string().min(10, {
    message: "Please enter a valid contact phone number.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
});

export function CreateClinicForm() {
  const queryClient = useQueryClient();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("Creating clinic with values:", values);
      const { error } = await supabase.from('clinics').insert({
        name: values.name,
        email: values.email,
        phone: values.phone,
        doctor_name: values.doctorName,
        contact_person: values.contactPerson,
        contact_phone: values.contactPhone,
        address: values.address,
        user_id: (await supabase.auth.getUser()).data.user?.id
      });

      if (error) throw error;

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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Clinic Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter clinic name" 
                    {...field}
                    className="h-11 bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="Enter email" 
                    {...field}
                    className="h-11 bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Phone</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter phone number" 
                    {...field}
                    className="h-11 bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="doctorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Doctor Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter doctor name" 
                    {...field}
                    className="h-11 bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Point of Contact</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter point of contact name" 
                    {...field}
                    className="h-11 bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">POC Phone</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter point of contact phone" 
                    {...field}
                    className="h-11 bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
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