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
import { Clinic } from "./types";

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
  street_address: z.string().min(5, {
    message: "Street address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().length(2, {
    message: "State must be 2 characters.",
  }),
  zip_code: z.string().length(5, {
    message: "ZIP code must be 5 characters.",
  }),
});

interface EditClinicFormProps {
  clinic: Clinic;
}

export function EditClinicForm({ clinic }: EditClinicFormProps) {
  const queryClient = useQueryClient();
  
  // Split the address into components
  const addressParts = clinic.address?.split(',').map(part => part.trim()) || ['', '', ''];
  const stateZip = addressParts[2]?.split(' ') || ['', ''];
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: clinic.name,
      email: clinic.email,
      phone: clinic.phone,
      doctorName: clinic.doctor_name,
      contactPerson: clinic.contact_person,
      contactPhone: clinic.contact_phone,
      street_address: addressParts[0] || '',
      city: addressParts[1] || '',
      state: stateZip[0] || '',
      zip_code: stateZip[1] || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
          contact_person: values.contactPerson,
          contact_phone: values.contactPhone,
          address: formattedAddress,
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
          name="street_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Street Address</FormLabel>
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

        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="City" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="CA" maxLength={2} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="12345" maxLength={5} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
