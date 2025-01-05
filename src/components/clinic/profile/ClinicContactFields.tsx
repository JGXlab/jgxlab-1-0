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

interface ClinicContactFieldsProps {
  form: UseFormReturn<Clinic>;
}

export function ClinicContactFields({ form }: ClinicContactFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="doctor_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Doctor Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter doctor name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contact_person"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Person</FormLabel>
            <FormControl>
              <Input placeholder="Enter contact person name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contact_phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Phone</FormLabel>
            <FormControl>
              <Input placeholder="Enter contact phone" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}