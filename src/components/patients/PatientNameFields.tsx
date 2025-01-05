import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User, Users } from "lucide-react";

export function PatientNameFields({ form }) {
  return (
    <div className="flex flex-col gap-6">
      <FormField
        control={form.control}
        name="first_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <User className="h-4 w-4 text-primary" />
              First Name
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter first name"
                className="bg-white border-gray-200 focus:border-primary/30 focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                {...field}
              />
            </FormControl>
            <FormMessage className="text-destructive/90 text-sm mt-1" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="last_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <Users className="h-4 w-4 text-primary" />
              Last Name
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter last name"
                className="bg-white border-gray-200 focus:border-primary/30 focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-lg"
                {...field}
              />
            </FormControl>
            <FormMessage className="text-destructive/90 text-sm mt-1" />
          </FormItem>
        )}
      />
    </div>
  );
}