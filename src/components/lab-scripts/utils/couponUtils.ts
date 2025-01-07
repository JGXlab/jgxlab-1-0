export const generateCoupon = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const isCouponValid = async (couponCode: string, patientId: string) => {
  const { data: labScript, error } = await supabase
    .from('lab_scripts')
    .select('*')
    .eq('patient_id', patientId)
    .eq('coupon_code', couponCode)
    .eq('appliance_type', 'surgical-day')
    .single();

  if (error) {
    console.error('Error checking coupon:', error);
    return false;
  }

  return !!labScript;
};