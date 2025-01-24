import React from "react";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArchSelector } from "./ArchSelector";
import { TreatmentTypeSelector } from "./TreatmentTypeSelector";
import { ScrewTypeSelector } from "./ScrewTypeSelector";
import { VDODetailsSelector } from "./VDODetailsSelector";
import { NightguardSelector } from "./NightguardSelector";
import { ShadeSelector } from "./ShadeSelector";
import { FormSection } from "./FormSection";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./formSchema";
import { RequiredIndicator } from "./RequiredIndicator";

interface ApplianceDetailsSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export const ApplianceDetailsSection = ({ form }: ApplianceDetailsSectionProps) => {
  const applianceType = form.watch('applianceType');
  const treatmentType = form.watch('treatmentType');
  const isNightguard = applianceType === 'nightguard';
  const isSurgicalDay = applianceType === 'surgical-day';

  const shouldHideScrewSection = (value: string) => {
    const [upper, lower] = value.split('|');
    return (upper === 'denture' || upper === 'one-piece-implant') && 
           (lower === 'denture' || lower === 'one-piece-implant' || !lower);
  };

  const hideScrewSection = shouldHideScrewSection(treatmentType);

  React.useEffect(() => {
    if (isNightguard) {
      form.setValue('treatmentType', '');
      form.setValue('screwType', '');
      form.setValue('vdoDetails', '');
      form.setValue('needsNightguard', '');
      form.setValue('shade', '');
    }
    form.setValue('is_free_printed_tryin', false);
    form.setValue('couponCode', '');
  }, [applianceType, form]);

  React.useEffect(() => {
    if (hideScrewSection) {
      form.setValue('screwType', '');
      form.setValue('otherScrewType', '');
    }
  }, [hideScrewSection, form]);

  return (
    <FormSection title="Appliance Details" className="pt-6 border-t">
      <FormField
        control={form.control}
        name="applianceType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Appliance Type <RequiredIndicator /></FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select appliance type" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="surgical-day">Surgical Day Appliance</SelectItem>
                <SelectItem value="printed-try-in">Printed Try-in</SelectItem>
                <SelectItem value="nightguard">Nightguard</SelectItem>
                <SelectItem value="direct-load-pmma">Direct Load PMMA</SelectItem>
                <SelectItem value="direct-load-zirconia">Direct Load Zirconia</SelectItem>
                <SelectItem value="ti-bar">Ti-bar and Super Structure</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="arch"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Arch Type <RequiredIndicator /></FormLabel>
            <ArchSelector value={field.value} onChange={field.onChange} />
          </FormItem>
        )}
      />

      {!isNightguard && (
        <>
          <FormField
            control={form.control}
            name="treatmentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Treatment Type <RequiredIndicator /></FormLabel>
                <TreatmentTypeSelector 
                  value={field.value} 
                  onChange={field.onChange}
                  selectedArch={[form.watch('arch')]}
                />
              </FormItem>
            )}
          />

          {!hideScrewSection && (
            <FormField
              control={form.control}
              name="screwType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Screw Type <RequiredIndicator /></FormLabel>
                  <ScrewTypeSelector 
                    value={field.value} 
                    onChange={field.onChange}
                    otherValue={form.watch('otherScrewType')}
                    onOtherValueChange={(value) => form.setValue('otherScrewType', value)}
                  />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="vdoDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VDO Details <RequiredIndicator /></FormLabel>
                <VDODetailsSelector value={field.value} onChange={field.onChange} />
              </FormItem>
            )}
          />

          {!isSurgicalDay && (
            <FormField
              control={form.control}
              name="needsNightguard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Do you need Nightguard? <RequiredIndicator /></FormLabel>
                  <NightguardSelector value={field.value} onChange={field.onChange} />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="shade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shade <RequiredIndicator /></FormLabel>
                <ShadeSelector value={field.value} onChange={field.onChange} />
              </FormItem>
            )}
          />
        </>
      )}
    </FormSection>
  );
};