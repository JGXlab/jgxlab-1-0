export type Clinic = {
  id: string;
  name: string;
  email: string;
  phone: string;
  doctor_name: string;
  address?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  auth_user_id: string;
};