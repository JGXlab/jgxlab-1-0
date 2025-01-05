import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import type { Clinic } from "@/components/clinics/types";

interface ClinicAddressFieldProps {
  form: UseFormReturn<Clinic>;
}

export function ClinicAddressField({ form }: ClinicAddressFieldProps) {
  return (
    <FormField
      control={form.control}
      name="address"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Address</FormLabel>
          <FormControl>
            <Input placeholder="Enter clinic address" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}