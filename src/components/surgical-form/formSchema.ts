import * as z from "zod";

export const formSchema = z.object({
  patientId: z.string().min(1, "Patient selection is required"),
  applianceType: z.string().min(1, "Appliance type is required"),
  arch: z.string().min(1, "Arch type must be selected"),
  treatmentType: z.string().min(1, "Treatment type is required"),
  screwType: z.string().min(1, "Screw type must be selected"),
  otherScrewType: z.string().optional(),
  vdoDetails: z.string().min(1, "VDO detail must be selected"),
  needsNightguard: z.string().min(1, "Please specify if nightguard is needed"),
  shade: z.string().min(1, "Shade must be selected"),
  dueDate: z.string().min(1, "Due date is required"),
  specificInstructions: z.string().optional(),
  expressDesign: z.string().min(1, "Please specify if express design is needed"),
});