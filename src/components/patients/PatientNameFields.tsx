import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User, Users } from "lucide-react";

export function PatientNameFields({ form }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="first_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-foreground/80 font-medium">
              <User className="h-4 w-4 text-primary/80" />
              First Name
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter first name"
                className="bg-background/50 border-border/20 focus:border-primary/30 transition-colors duration-200"
                {...field}
              />
            </FormControl>
            <FormMessage className="text-destructive/90 text-sm" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="last_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-foreground/80 font-medium">
              <Users className="h-4 w-4 text-primary/80" />
              Last Name
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter last name"
                className="bg-background/50 border-border/20 focus:border-primary/30 transition-colors duration-200"
                {...field}
              />
            </FormControl>
            <FormMessage className="text-destructive/90 text-sm" />
          </FormItem>
        )}
      />
    </div>
  );
}