import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSection } from "./FormSection";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./formSchema";
import { SelectionButton } from "./SelectionButton";
import { addDays, format, isWeekend } from "date-fns";
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

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

  // Calculate minimum due date based on appliance type
  const minDueDate = appliancesWithLeadTime.includes(applianceType) 
    ? format(addDays(new Date(), 4), 'yyyy-MM-dd')
    : format(new Date(), 'yyyy-MM-dd');

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    
    // Convert to EST timezone
    const timeZone = 'America/New_York';
    const estDate = utcToZonedTime(selectedDate, timeZone);
    
    if (isWeekend(estDate)) {
      alert('Weekend dates (Saturday and Sunday) are not available. Please select a weekday.');
      e.target.value = form.getValues('dueDate') || minDueDate;
      return;
    }
    
    form.setValue('dueDate', e.target.value);
  };

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
              onChange={handleDateChange}
              min={minDueDate}
            />
            {appliancesWithLeadTime.includes(applianceType) && (
              <p className="text-sm text-muted-foreground mt-1">
                This appliance type requires a minimum of 4 working days for design completion.
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