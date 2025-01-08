import { z } from "zod";

export const editClinicFormSchema = z.object({
  name: z.string().min(2, {
    message: "Clinic name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  doctorName: z.string().min(2, {
    message: "Doctor name must be at least 2 characters.",
  }),
  street_address: z.string().min(5, {
    message: "Street address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().length(2, {
    message: "State must be 2 characters.",
  }),
  zip_code: z.string().length(5, {
    message: "ZIP code must be 5 characters.",
  }),
});

export type EditClinicFormValues = z.infer<typeof editClinicFormSchema>;