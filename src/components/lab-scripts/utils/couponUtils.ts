import { supabase } from "@/integrations/supabase/client";

export const generateCoupon = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const isCouponValid = async (couponCode: string, patientId: string) => {
  console.log('Checking coupon validity for:', { couponCode, patientId });
  
  // First check if this coupon exists in a surgical-day lab script for this patient
  const { data: surgicalScript, error: surgicalError } = await supabase
    .from('lab_scripts')
    .select('*')
    .eq('patient_id', patientId)
    .eq('appliance_type', 'surgical-day')
    .eq('coupon_code', couponCode)
    .maybeSingle();

  if (surgicalError) {
    console.error('Error checking surgical script:', surgicalError);
    return false;
  }

  if (!surgicalScript) {
    console.log('No valid surgical script found with this coupon');
    return false;
  }

  // Then check if this patient has already used a free printed try-in
  const { data: existingTryIn, error: tryInError } = await supabase
    .from('lab_scripts')
    .select('*')
    .eq('patient_id', patientId)
    .eq('appliance_type', 'printed-try-in')
    .eq('is_free_printed_tryin', true)
    .maybeSingle();

  if (tryInError) {
    console.error('Error checking existing try-in:', tryInError);
    return false;
  }

  if (existingTryIn) {
    console.log('Patient already has a free printed try-in');
    return false;
  }

  console.log('Coupon is valid');
  return true;
};