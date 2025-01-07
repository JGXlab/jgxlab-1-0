import { supabase } from "@/integrations/supabase/client";

export interface CouponValidationResult {
  isValid: boolean;
  message: string;
  surgicalDayScript?: any;
}

export const validateCoupon = async (couponCode: string, patientId: string): Promise<CouponValidationResult> => {
  console.log('Validating coupon:', { couponCode, patientId });

  if (!couponCode || !patientId) {
    return { isValid: false, message: "Invalid coupon code or patient" };
  }

  // Check if this patient already has a free printed try-in
  const { data: existingFreeScript } = await supabase
    .from('lab_scripts')
    .select('id')
    .eq('patient_id', patientId)
    .eq('is_free_printed_tryin', true)
    .maybeSingle();

  if (existingFreeScript) {
    return { isValid: false, message: "Patient has already used a free printed try-in" };
  }

  // Find the surgical day script with this coupon
  const { data: surgicalDayScript, error } = await supabase
    .from('lab_scripts')
    .select('*')
    .eq('coupon_code', couponCode)
    .eq('patient_id', patientId)
    .eq('appliance_type', 'surgical-day')
    .maybeSingle();

  if (error) {
    console.error('Error validating coupon:', error);
    return { isValid: false, message: "Error validating coupon" };
  }

  if (!surgicalDayScript) {
    return { isValid: false, message: "Invalid coupon code" };
  }

  // Check if coupon has been used
  const { data: usedCoupon } = await supabase
    .from('lab_scripts')
    .select('id')
    .eq('coupon_code', couponCode)
    .eq('is_free_printed_tryin', true)
    .maybeSingle();

  if (usedCoupon) {
    return { isValid: false, message: "Coupon has already been used" };
  }

  return {
    isValid: true,
    message: "Valid coupon code",
    surgicalDayScript
  };
};