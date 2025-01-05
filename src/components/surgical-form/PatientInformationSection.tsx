import { FormSection } from "./FormSection";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./formSchema";
import { PatientSelector } from "../patients/PatientSelector";
import { FormField, FormItem, FormLabel } from "../ui/form";

interface PatientInformationSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function PatientInformationSection({ form }: PatientInformationSectionProps) {
  return (
    <FormSection title="Patient Information">
      <FormField
        control={form.control}
        name="patientId"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormLabel className="text-sm font-medium text-gray-900">Patient</FormLabel>
            <PatientSelector 
              value={field.value} 
              onChange={field.onChange}
              className="w-full bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </FormItem>
        )}
      />
    </FormSection>
  );
}