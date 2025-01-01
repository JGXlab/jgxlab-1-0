import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export function PatientDateOfBirthField({ form }) {
  return (
    <FormField
      control={form.control}
      name="date_of_birth"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-foreground font-medium">Date of Birth</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={`w-full pl-3 text-left font-normal ${
                    !field.value && "text-muted-foreground"
                  }`}
                >
                  {field.value ? (
                    format(new Date(field.value), "MMMM d, yyyy")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  if (date) {
                    form.setValue('date_of_birth', format(date, 'yyyy-MM-dd'));
                  }
                }}
                disabled={(date) => date > new Date()}
                initialFocus
                className="rounded-lg border shadow-md bg-white"
              />
            </PopoverContent>
          </Popover>
          <FormMessage className="text-destructive" />
        </FormItem>
      )}
    />
  );
}