import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User, Users } from "lucide-react";

export function PatientNameFields({ form }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="first_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-foreground font-medium">
              <User className="h-4 w-4 text-primary" />
              First Name
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter first name"
                className="bg-background text-foreground placeholder:text-muted-foreground border-input"
                {...field}
              />
            </FormControl>
            <FormMessage className="text-destructive" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="last_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-foreground font-medium">
              <Users className="h-4 w-4 text-primary" />
              Last Name
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter last name"
                className="bg-background text-foreground placeholder:text-muted-foreground border-input"
                {...field}
              />
            </FormControl>
            <FormMessage className="text-destructive" />
          </FormItem>
        )}
      />
    </div>
  );
}