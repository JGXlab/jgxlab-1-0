import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./formSchema";
import { FormSection } from "./FormSection";
import { PatientSelector } from "@/components/patients/PatientSelector";
import { RequiredIndicator } from "./RequiredIndicator";

interface PatientInformationSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const PatientInformationSection = ({ form }: PatientInformationSectionProps) => {
  return (
    <FormSection title="Patient Information">
      <FormField
        control={form.control}
        name="patientId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Select Patient <RequiredIndicator />
            </FormLabel>
            <FormControl>
              <PatientSelector
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </FormSection>
  );
};