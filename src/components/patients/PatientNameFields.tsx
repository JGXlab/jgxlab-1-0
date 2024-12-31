import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User, Users } from "lucide-react";

export function PatientNameFields({ form }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              First Name
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter first name"
                className="bg-white/50 border-primary/20 focus:border-primary"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Last Name
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter last name"
                className="bg-white/50 border-primary/20 focus:border-primary"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}