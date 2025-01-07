export type Clinic = {
  id: string;
  name: string;
  email: string;
  phone: string;
  doctor_name: string;
  contact_person: string;
  contact_phone: string;
  address?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
};