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

interface ContactInfoProps {
  control: Control<Clinic>;
}

export function ContactInfo({ control }: ContactInfoProps) {
  const RequiredIndicator = () => (
    <Star className="inline-block w-2 h-2 text-destructive ml-1" />
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Address Information</h3>
      
      <FormField
        control={control}
        name="street_address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Street Address
              <RequiredIndicator />
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="123 Main St" required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <FormField
          control={control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                City
                <RequiredIndicator />
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="City" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                State
                <RequiredIndicator />
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="CA" maxLength={2} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="zip_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                ZIP Code
                <RequiredIndicator />
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="12345" maxLength={5} required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}