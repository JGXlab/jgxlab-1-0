import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import type { Clinic } from "@/components/clinics/types";

interface ContactFieldsProps {
  form: UseFormReturn<Clinic>;
}

export function ContactFields({ form }: ContactFieldsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FormField
        control={form.control}
        name="doctor_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Doctor Name</FormLabel>
            <FormControl>
              <Input {...field} />
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
              <Input {...field} />
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
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}