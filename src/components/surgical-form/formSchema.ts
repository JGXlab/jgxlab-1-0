import { z } from "zod";

export const formSchema = z.object({
  patientId: z.string().min(1, "Please select a patient"),
  applianceType: z.string().min(1, "Please select appliance type"),
  arch: z.string().min(1, "Please select arch type"),
  treatmentType: z.string().min(1, "Please select treatment type"),
  screwType: z.string().optional(),
  otherScrewType: z.string().optional().superRefine((val, ctx) => {
    if (ctx.parent.screwType === 'others' && (!val || val.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please specify the screw type"
      });
    }
  }),
  vdoDetails: z.string().min(1, "Please select VDO details"),
  needsNightguard: z.string().optional(),
  shade: z.string().min(1, "Please select shade"),
  dueDate: z.string().min(1, "Please select due date"),
  specificInstructions: z.string().min(1, "Please enter specific instructions"),
  expressDesign: z.string().optional(),
  couponCode: z.string().optional(),
  is_free_printed_tryin: z.boolean().optional(),
});