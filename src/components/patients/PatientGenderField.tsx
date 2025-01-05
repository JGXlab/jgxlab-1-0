import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart } from "lucide-react";

export function PatientGenderField({ form }) {
  return (
    <FormField
      control={form.control}
      name="gender"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2 text-foreground/80 font-medium">
            <Heart className="h-4 w-4 text-primary/80" />
            Gender
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="bg-background/50 border-border/20 focus:border-primary/30 transition-colors duration-200">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="bg-background/95 backdrop-blur-sm border-border/20">
              <SelectItem value="male" className="text-foreground/80 hover:text-foreground focus:text-foreground transition-colors">Male</SelectItem>
              <SelectItem value="female" className="text-foreground/80 hover:text-foreground focus:text-foreground transition-colors">Female</SelectItem>
              <SelectItem value="other" className="text-foreground/80 hover:text-foreground focus:text-foreground transition-colors">Other</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage className="text-destructive/90 text-sm" />
        </FormItem>
      )}
    />
  );
}