import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function PatientDateOfBirthField({ form }: { form: any }) {
  return (
    <FormField
      control={form.control}
      name="dateOfBirth"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-foreground font-medium">Date of Birth</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal bg-background border-input",
                    !field.value && "text-foreground"
                  )}
                >
                  {field.value ? (
                    <span className="text-foreground">{format(field.value, "PPP")}</span>
                  ) : (
                    <span className="text-foreground">Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 text-foreground" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-background border-input" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
                className="bg-background text-foreground"
              />
            </PopoverContent>
          </Popover>
          <FormMessage className="text-destructive" />
        </FormItem>
      )}
    />
  );
}