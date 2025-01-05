import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "./formSchema";
import { PatientSelector } from "../patients/PatientSelector";
import { FormField, FormItem, FormLabel } from "../ui/form";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { CreatePatientForm } from "../patients/CreatePatientForm";
import { useState } from "react";
import { FormSection } from "./FormSection";

interface PatientInformationSectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function PatientInformationSection({ form }: PatientInformationSectionProps) {
  const [createPatientOpen, setCreatePatientOpen] = useState(false);

  return (
    <FormSection title="Patient Information">
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-sm font-medium text-gray-900">Patient</FormLabel>
              <div className="flex items-center gap-2">
                <PatientSelector 
                  value={field.value} 
                  onChange={field.onChange}
                  className="w-full bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setCreatePatientOpen(true)}
                >
                  New Patient
                </Button>
              </div>
            </FormItem>
          )}
        />
      </div>

      <Dialog open={createPatientOpen} onOpenChange={setCreatePatientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Patient</DialogTitle>
          </DialogHeader>
          <CreatePatientForm 
            onSuccess={() => setCreatePatientOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </FormSection>
  );
}