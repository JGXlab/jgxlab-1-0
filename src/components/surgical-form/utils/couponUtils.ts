import { supabase } from "@/integrations/supabase/client";

export interface CouponValidationResult {
  isValid: boolean;
  message: string;
  surgicalDayScript?: any;
  archType?: string;
}

export const validateCoupon = async (couponCode: string, patientId: string): Promise<CouponValidationResult> => {
  console.log('Validating coupon:', { couponCode, patientId });

  if (!couponCode || !patientId) {
    return { isValid: false, message: "Invalid coupon code or patient" };
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
    return { isValid: false, message: "Invalid coupon code or no matching surgical day script found" };
  }

  // Check if a free printed try-in has already been used for this surgical day script's arch type
  const { data: existingFreeScript } = await supabase
    .from('lab_scripts')
    .select('id')
    .eq('patient_id', patientId)
    .eq('is_free_printed_tryin', true)
    .eq('arch', surgicalDayScript.arch)
    .maybeSingle();

  if (existingFreeScript) {
    return { 
      isValid: false, 
      message: `Patient has already used a free printed try-in for ${surgicalDayScript.arch} arch` 
    };
  }

  // Check if this specific coupon has been used
  const { data: usedCoupon } = await supabase
    .from('lab_scripts')
    .select('id')
    .eq('coupon_code', couponCode)
    .eq('is_free_printed_tryin', true)
    .maybeSingle();

  if (usedCoupon) {
    return { isValid: false, message: "This coupon has already been used" };
  }

  console.log('Coupon validation successful:', surgicalDayScript);
  return {
    isValid: true,
    message: "Valid coupon code - Free printed try-in will be applied",
    surgicalDayScript,
    archType: surgicalDayScript.arch
  };
};