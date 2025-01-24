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
import { Star } from "lucide-react";

interface BasicClinicInfoProps {
  control: Control<Clinic>;
}

export function BasicClinicInfo({ control }: BasicClinicInfoProps) {
  const RequiredIndicator = () => (
    <Star className="inline-block w-2 h-2 text-destructive ml-1" />
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Clinic Name
              <RequiredIndicator />
            </FormLabel>
            <FormControl>
              <Input {...field} required />
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
            <FormLabel>
              Email
              <RequiredIndicator />
            </FormLabel>
            <FormControl>
              <Input {...field} type="email" required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <PhoneNumberInput
        control={control}
        name="phone"
        label="Phone"
        required
      />

      <FormField
        control={control}
        name="doctor_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Doctor Name
              <RequiredIndicator />
            </FormLabel>
            <FormControl>
              <Input {...field} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}