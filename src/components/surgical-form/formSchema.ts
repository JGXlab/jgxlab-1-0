import { z } from "zod";

export const formSchema = z.object({
  patientId: z.string().min(1, "Please select a patient"),
  applianceType: z.string().min(1, "Please select appliance type"),
  arch: z.string().min(1, "Please select arch type"),
  treatmentType: z.string(),
  screwType: z.string(),
  otherScrewType: z.string(),
  vdoDetails: z.string(),
  needsNightguard: z.string(),
  shade: z.string(),
  dueDate: z.string().min(1, "Please select due date"),
  specificInstructions: z.string(),
  expressDesign: z.string(),
  couponCode: z.string().optional(),
  is_free_printed_tryin: z.boolean().optional(),
});