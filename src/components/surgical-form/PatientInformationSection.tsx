import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { PatientSelector } from "@/components/patients/PatientSelector";
import { FormSection } from "./FormSection";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./formSchema";

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
            <FormLabel>Patient</FormLabel>
            <PatientSelector value={field.value} onChange={field.onChange} />
          </FormItem>
        )}
      />
    </FormSection>
  );
};