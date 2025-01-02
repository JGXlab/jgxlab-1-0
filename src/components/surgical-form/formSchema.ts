import { z } from "zod";

export const formSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  applianceType: z.string().min(1, "Appliance type is required"),
  expressDesign: z.string().min(1, "Express design selection is required"),
  arch: z.string().min(1, "Arch is required"),
  treatmentType: z.string().min(1, "Treatment type is required"),
  screwType: z.string().optional(),
  otherScrewType: z.string().optional(),
  vdoDetails: z.string().optional(),
  needsNightguard: z.string().optional(),
  shade: z.string().optional(),
  dueDate: z.string().min(1, "Due date is required"),
  specificInstructions: z.string().optional(),
});