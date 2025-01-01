import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PatientGenderField({ form }) {
  return (
    <FormField
      control={form.control}
      name="gender"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-foreground font-medium">Gender</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="bg-background text-[#C8C8C9] border-input">
                <SelectValue placeholder="Select gender" className="text-[#C8C8C9]" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-background border-input shadow-md z-50">
              <SelectItem value="male" className="text-[#C8C8C9]">Male</SelectItem>
              <SelectItem value="female" className="text-[#C8C8C9]">Female</SelectItem>
              <SelectItem value="other" className="text-[#C8C8C9]">Other</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage className="text-destructive" />
        </FormItem>
      )}
    />
  );
}