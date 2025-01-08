import { z } from "zod";

export const clinicFormSchema = z.object({
  name: z.string().min(2, {
    message: "Clinic name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  doctor_name: z.string().min(2, {
    message: "Doctor name must be at least 2 characters.",
  }),
  contact_person: z.string().min(2, {
    message: "Contact person name must be at least 2 characters.",
  }),
  contact_phone: z.string().min(10, {
    message: "Please enter a valid contact phone number.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
});

export type CreateClinicFormValues = z.infer<typeof clinicFormSchema>;