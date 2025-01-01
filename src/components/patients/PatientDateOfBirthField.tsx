import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";

export function PatientDateOfBirthField({ form }) {
  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) {
      value = value.slice(0, 8);
    }
    if (value.length >= 4) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4) + '/' + value.slice(4);
    } else if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    form.setValue('date_of_birth', value);
  };

  return (
    <FormField
      control={form.control}
      name="date_of_birth"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2 text-foreground font-medium">
            <Calendar className="h-4 w-4 text-primary" />
            Date of Birth
          </FormLabel>
          <FormControl>
            <Input
              placeholder="MM/DD/YYYY"
              className="bg-background text-[#C8C8C9] placeholder:text-[#C8C8C9] border-input"
              {...field}
              onChange={handleDateInput}
              maxLength={10}
            />
          </FormControl>
          <FormMessage className="text-destructive" />
        </FormItem>
      )}
    />
  );
}