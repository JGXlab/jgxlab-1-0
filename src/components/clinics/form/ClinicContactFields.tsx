import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateClinicFormValues } from "../types/clinic-form";
import { PhoneNumberInput } from "@/components/clinic/PhoneNumberInput";

interface ClinicContactFieldsProps {
  form: UseFormReturn<CreateClinicFormValues>;
}

export function ClinicContactFields({ form }: ClinicContactFieldsProps) {
  return (
    <>
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

      <PhoneNumberInput
        control={form.control}
        name="contactPhone"
        label="POC Phone"
      />
    </>
  );
}