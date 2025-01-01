import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CreateClinicFormValues } from "../types/clinic-form";

interface ClinicBasicInfoFieldsProps {
  form: UseFormReturn<CreateClinicFormValues>;
}

export function ClinicBasicInfoFields({ form }: ClinicBasicInfoFieldsProps) {
  return (
    <>
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
    </>
  );
}