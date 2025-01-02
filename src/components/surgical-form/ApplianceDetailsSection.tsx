import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { FormSection } from "./FormSection";
import { SelectionButton } from "./SelectionButton";
import { ArchSelector } from "./ArchSelector";
import { TreatmentTypeSelector } from "./TreatmentTypeSelector";
import { ScrewTypeSelector } from "./ScrewTypeSelector";
import { VDODetailsSelector } from "./VDODetailsSelector";
import { NightguardSelector } from "./NightguardSelector";
import { ShadeSelector } from "./ShadeSelector";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./formSchema";

interface ApplianceDetailsSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const ApplianceDetailsSection = ({ form }: ApplianceDetailsSectionProps) => {
  return (
    <FormSection 
      title="Appliance Details" 
      description="Specify the details of the appliance"
    >
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

      <FormField
        control={form.control}
        name="arch"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Arch</FormLabel>
            <ArchSelector value={field.value} onChange={field.onChange} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="treatmentType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Treatment Type</FormLabel>
            <TreatmentTypeSelector 
              value={field.value} 
              onChange={field.onChange} 
              selectedArch={[form.watch("arch")]} 
            />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="screwType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Screw Type</FormLabel>
            <ScrewTypeSelector 
              value={field.value} 
              onChange={field.onChange}
              otherValue={form.watch("otherScrewType")}
              onOtherValueChange={(value) => form.setValue("otherScrewType", value)}
            />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="vdoDetails"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>VDO Details</FormLabel>
            <VDODetailsSelector value={field.value} onChange={field.onChange} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="needsNightguard"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Nightguard</FormLabel>
            <NightguardSelector value={field.value} onChange={field.onChange} />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="shade"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Shade</FormLabel>
            <ShadeSelector value={field.value} onChange={field.onChange} />
          </FormItem>
        )}
      />
    </FormSection>
  );
};