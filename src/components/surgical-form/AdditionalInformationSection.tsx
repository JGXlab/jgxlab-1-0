import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSection } from "./FormSection";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./formSchema";
import { SelectionButton } from "./SelectionButton";

interface AdditionalInformationSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const AdditionalInformationSection = ({ form }: AdditionalInformationSectionProps) => {
  const applianceType = form.watch('applianceType');
  const showExpressDesign = applianceType !== 'surgical-day';

  return (
    <FormSection title="Additional Information" className="pt-6 border-t">
      {showExpressDesign && (
        <FormField
          control={form.control}
          name="expressDesign"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Express Design (within 24 hours)</FormLabel>
              <div className="flex flex-wrap gap-4">
                <SelectionButton
                  label="Yes"
                  isSelected={field.value === "yes"}
                  onClick={() => field.onChange("yes")}
                />
                <SelectionButton
                  label="No"
                  isSelected={field.value === "no"}
                  onClick={() => field.onChange("no")}
                />
              </div>
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="dueDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Due Date</FormLabel>
            <Input type="date" className="max-w-xs bg-white" {...field} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="specificInstructions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Specific Instructions</FormLabel>
            <Textarea 
              placeholder="Enter any specific instructions or notes"
              className="min-h-[100px] resize-none bg-white"
              {...field}
            />
          </FormItem>
        )}
      />
    </FormSection>
  );
};