import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSection } from "./FormSection";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./formSchema";
import { SelectionButton } from "./SelectionButton";
import { addDays, format, isWeekend } from "date-fns";
import { RequiredIndicator } from "./RequiredIndicator";

interface AdditionalInformationSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const AdditionalInformationSection = ({ form }: AdditionalInformationSectionProps) => {
  const applianceType = form.watch('applianceType');
  const expressDesign = form.watch('expressDesign');
  const showExpressDesign = applianceType !== 'surgical-day';

  const appliancesWithLeadTime = [
    'printed-try-in',
    'nightguard',
    'direct-load-pmma',
    'direct-load-zirconia',
    'ti-bar'
  ];

  const calculateMinDueDate = () => {
    if (expressDesign === 'yes') {
      let nextDay = addDays(new Date(), 1);
      while (isWeekend(nextDay)) {
        nextDay = addDays(nextDay, 1);
      }
      return format(nextDay, 'yyyy-MM-dd');
    }

    if (!appliancesWithLeadTime.includes(applianceType)) {
      return format(new Date(), 'yyyy-MM-dd');
    }

    let date = new Date();
    let daysToAdd = 4;
    let daysAdded = 0;

    while (daysAdded < daysToAdd) {
      date = addDays(date, 1);
      if (!isWeekend(date)) {
        daysAdded++;
      }
    }

    while (isWeekend(date)) {
      date = addDays(date, 1);
    }

    return format(date, 'yyyy-MM-dd');
  };

  const minDueDate = calculateMinDueDate();

  return (
    <FormSection title="Additional Information" className="pt-6 border-t">
      {showExpressDesign && (
        <FormField
          control={form.control}
          name="expressDesign"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Express Design (within 24 hours) <RequiredIndicator /></FormLabel>
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
            <FormLabel>Due Date <RequiredIndicator /></FormLabel>
            <Input 
              type="date" 
              className="max-w-xs bg-white" 
              {...field} 
              min={minDueDate}
            />
            {appliancesWithLeadTime.includes(applianceType) && expressDesign !== 'yes' && (
              <p className="text-sm text-muted-foreground mt-1">
                This appliance type requires a minimum of 4 working days (excluding weekends) for design completion.
              </p>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="specificInstructions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Specific Instructions <RequiredIndicator /></FormLabel>
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