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
import { Star } from "lucide-react";

interface PhoneNumberInputProps {
  control: Control<Clinic>;
  name: "phone";
  label: string;
  required?: boolean;
}

export function PhoneNumberInput({ control, name, label, required }: PhoneNumberInputProps) {
  const RequiredIndicator = () => (
    <Star className="inline-block w-2 h-2 text-destructive ml-1" />
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <RequiredIndicator />}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              type="tel"
              placeholder="(123) 456-7890"
              required={required}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}