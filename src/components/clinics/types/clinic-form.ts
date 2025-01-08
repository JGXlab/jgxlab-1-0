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
  street_address: z.string().min(5, {
    message: "Street address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().length(2, {
    message: "State must be a 2-letter code.",
  }),
  zip_code: z.string().length(5, {
    message: "ZIP code must be 5 digits.",
  }),
});

export type CreateClinicFormValues = z.infer<typeof clinicFormSchema>;