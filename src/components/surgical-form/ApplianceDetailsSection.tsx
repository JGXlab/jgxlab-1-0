import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { FormSection } from "./FormSection";
import { SelectionButton } from "./SelectionButton";
import { ArchSelector } from "./ArchSelector";
import { TreatmentTypeSelector } from "./TreatmentTypeSelector";
import { ScrewTypeSelector } from "./ScrewTypeSelector";
import { VDODetailsSelector } from "./VDODetailsSelector";
import { NightguardSelector } from "./NightguardSelector";
import { ShadeSelector } from "./ShadeSelector";

export const ApplianceDetailsSection = ({ form }: { form: any }) => {
  return (
    <FormSection title="Appliance Details" description="Specify the details of the appliance">
      <FormField
        control={form.control}
        name="applianceType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Appliance Type</FormLabel>
            <div className="flex flex-wrap gap-3">
              <SelectionButton
                label="Fixed"
                isSelected={field.value === "fixed"}
                onClick={() => field.onChange("fixed")}
              />
              <SelectionButton
                label="Removable"
                isSelected={field.value === "removable"}
                onClick={() => field.onChange("removable")}
              />
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="expressDesign"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Do you need Express Design (within 24 hours)?</FormLabel>
            <div className="flex flex-wrap gap-3">
              <SelectionButton
                label="Yes"
                isSelected={field.value === "yes"}
                onClick={() => field.onChange("yes")}
              />
              <SelectionButton
                label="No"
                isSelected={field.value === "no"}
                onClick={() => field.onChange("no")}
              />
            </div>
          </FormItem>
        )}
      />

      <ArchSelector form={form} />
      <TreatmentTypeSelector form={form} />
      <ScrewTypeSelector form={form} />
      <VDODetailsSelector form={form} />
      <NightguardSelector form={form} />
      <ShadeSelector form={form} />
    </FormSection>
  );
};