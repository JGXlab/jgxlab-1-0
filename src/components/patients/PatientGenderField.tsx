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
              defaultValue={field.value}
              className="flex flex-col sm:flex-row gap-4"
            >
              {["male", "female", "other"].map((gender) => (
                <div key={gender} className="flex items-center">
                  <RadioGroupItem
                    value={gender}
                    id={gender}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={gender}
                    className="flex items-center justify-center px-4 py-2 rounded-lg border border-gray-200 bg-white cursor-pointer transition-all duration-200 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary hover:bg-gray-50 peer-checked:hover:bg-primary/90"
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage className="text-destructive/90 text-sm mt-2" />
        </FormItem>
      )}
    />
  );
}