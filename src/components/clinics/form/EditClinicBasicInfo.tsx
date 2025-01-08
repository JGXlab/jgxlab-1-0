import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn, Control } from "react-hook-form";
import { EditClinicFormValues } from "../types/edit-clinic-form";
import { PhoneNumberInput } from "@/components/clinic/PhoneNumberInput";
import type { Clinic } from "@/components/clinics/types";

interface EditClinicBasicInfoProps {
  form: UseFormReturn<EditClinicFormValues>;
}

export function EditClinicBasicInfo({ form }: EditClinicBasicInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                type="email" 
                placeholder="Enter email" 
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
    </div>
  );
}