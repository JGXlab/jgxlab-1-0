import { format } from "date-fns";
import { Tables } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface InvoiceProps {
  labScript: Tables<"lab_scripts">;
}

export const Invoice = ({ labScript }: InvoiceProps) => {
  const { data: clinic, isLoading: isLoadingClinic } = useQuery({
    queryKey: ['clinic', labScript.user_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clinics')
        .select('*')
        .eq('user_id', labScript.user_id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: patient, isLoading: isLoadingPatient } = useQuery({
    queryKey: ['patient', labScript.patient_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', labScript.patient_id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoadingClinic || isLoadingPatient) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const formatApplianceType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">INVOICE</h1>
          <p className="text-gray-500 mt-1">Payment ID: {labScript.payment_id}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500">Date</p>
          <p className="font-medium">
            {labScript.payment_date 
              ? format(new Date(labScript.payment_date), 'MMM dd, yyyy')
              : format(new Date(), 'MMM dd, yyyy')}
          </p>
        </div>
      </div>

      {/* Clinic and Patient Info */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">From</h2>
          <div className="text-gray-600">
            <p className="font-medium">{clinic?.name}</p>
            <p>{clinic?.address}</p>
            <p>Phone: {clinic?.phone}</p>
            <p>Email: {clinic?.email}</p>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Patient</h2>
          <div className="text-gray-600">
            <p className="font-medium">
              {patient?.first_name} {patient?.last_name}
            </p>
            <p>ID: {patient?.id}</p>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4">Service</th>
              <th className="text-right py-3 px-4">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-4 px-4">
                {formatApplianceType(labScript.appliance_type)}
                {labScript.arch === 'dual' && " (Dual Arch)"}
              </td>
              <td className="text-right py-4 px-4">
                ${labScript.amount_paid?.toFixed(2)}
              </td>
            </tr>
            {labScript.needs_nightguard === 'yes' && (
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4">Additional Nightguard</td>
                <td className="text-right py-4 px-4">Included</td>
              </tr>
            )}
            {labScript.express_design === 'yes' && (
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4">Express Design Service</td>
                <td className="text-right py-4 px-4">Additional Fee Included</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200">
              <td className="py-4 px-4 font-semibold">Total</td>
              <td className="text-right py-4 px-4 font-semibold">
                ${labScript.amount_paid?.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm">
        <p>Thank you for your business!</p>
        <p className="mt-1">
          If you have any questions, please contact us at {clinic?.email}
        </p>
      </div>
    </div>
  );
};