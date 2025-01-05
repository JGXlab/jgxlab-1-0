import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Clinic } from "@/components/clinics/types";
import { PhoneNumberInput } from "./PhoneNumberInput";

interface ContactInfoProps {
  control: Control<Clinic>;
}

export function ContactInfo({ control }: ContactInfoProps) {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={control}
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

        <PhoneNumberInput
          control={control}
          name="contact_phone"
          label="Contact Phone"
        />
      </div>

      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}