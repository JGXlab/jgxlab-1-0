import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heart } from "lucide-react";

export function PatientGenderField({ form }) {
  return (
    <FormField
      control={form.control}
      name="gender"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2 text-gray-700 font-medium mb-4">
            <Heart className="h-4 w-4 text-primary" />
            Gender
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-col sm:flex-row gap-4"
            >
              {["male", "female", "other"].map((gender) => (
                <FormItem key={gender} className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value={gender} id={gender} />
                  </FormControl>
                  <FormLabel
                    htmlFor={gender}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage className="text-destructive/90 text-sm mt-2" />
        </FormItem>
      )}
    />
  );
}