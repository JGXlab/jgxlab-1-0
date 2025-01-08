import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn, Control } from "react-hook-form";
import { CreateClinicFormValues } from "../types/clinic-form";
import { PhoneNumberInput } from "@/components/clinic/PhoneNumberInput";
import type { Clinic } from "@/components/clinics/types";

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
                placeholder="Enter clinic email" 
                type="email"
                {...field}
                className="h-11 bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <PhoneNumberInput
        control={form.control as unknown as Control<Clinic>}
        name="phone"
        label="Phone Number"
      />
    </>
  );
}