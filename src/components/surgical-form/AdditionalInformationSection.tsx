import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSection } from "./FormSection";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./formSchema";
import { SelectionButton } from "./SelectionButton";
import { addDays, format, isWeekend } from "date-fns";

interface AdditionalInformationSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const AdditionalInformationSection = ({ form }: AdditionalInformationSectionProps) => {
  const applianceType = form.watch('applianceType');
  const showExpressDesign = applianceType !== 'surgical-day';

  // Define appliance types that require 4 working days
  const appliancesWithLeadTime = [
    'printed-try-in',
    'nightguard',
    'direct-load-pmma',
    'direct-load-zirconia',
    'ti-bar'
  ];

  // Function to add working days (excluding weekends)
  const addWorkingDays = (startDate: Date, daysToAdd: number): Date => {
    console.log('Starting date:', startDate);
    let currentDate = new Date(startDate);
    let remainingDays = daysToAdd;

    while (remainingDays > 0) {
      currentDate = addDays(currentDate, 1);
      if (!isWeekend(currentDate)) {
        remainingDays--;
        console.log('Added working day:', currentDate, 'Remaining days:', remainingDays);
      } else {
        console.log('Skipped weekend day:', currentDate);
      }
    }

    console.log('Final date:', currentDate);
    return currentDate;
  };

  // Calculate minimum due date based on appliance type
  const minDueDate = appliancesWithLeadTime.includes(applianceType)
    ? format(addWorkingDays(new Date(), 4), 'yyyy-MM-dd')
    : format(new Date(), 'yyyy-MM-dd');

  console.log('Minimum due date calculated:', minDueDate);

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
            <Input 
              type="date" 
              className="max-w-xs bg-white" 
              {...field} 
              min={minDueDate}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                if (!isWeekend(selectedDate)) {
                  field.onChange(e);
                } else {
                  e.preventDefault();
                  alert("Weekend dates cannot be selected. Please choose a weekday.");
                }
              }}
            />
            {appliancesWithLeadTime.includes(applianceType) && (
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