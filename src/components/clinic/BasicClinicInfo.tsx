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

interface BasicClinicInfoProps {
  control: Control<Clinic>;
}

export function BasicClinicInfo({ control }: BasicClinicInfoProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Clinic Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} type="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <PhoneNumberInput
        control={control}
        name="phone"
        label="Phone"
      />

      <FormField
        control={control}
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
    </div>
  );
}