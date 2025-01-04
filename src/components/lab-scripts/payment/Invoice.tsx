import { format } from "date-fns";
import { Tables } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface InvoiceProps {
  labScript: Tables<"lab_scripts">;
  onDownload?: () => void;
}

export const Invoice = ({ labScript, onDownload }: InvoiceProps) => {
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
    <div className="bg-white w-[210mm] mx-auto p-12 shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>
          <div className="mt-4 space-y-1 text-sm">
            <p>Invoice number: {labScript.payment_id}</p>
            <p>Date of issue: {format(new Date(), 'MMMM d, yyyy')}</p>
            <p>Date due: {format(new Date(), 'MMMM d, yyyy')}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl text-gray-600">JGX Dental Lab LLC</h2>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">From</h3>
          <div className="space-y-1">
            <p>JGX Dental Lab LLC</p>
            <p>25 Highview Trail</p>
            <p>Pittsford, New York 14534</p>
            <p>United States</p>
            <p>+1 718-812-2869</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Bill to</h3>
          <div className="space-y-1">
            <p>{clinic?.name}</p>
            <p>{clinic?.address}</p>
            <p>{clinic?.phone}</p>
            <p>{clinic?.email}</p>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="mb-12">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 text-gray-600">Description</th>
              <th className="text-center py-3 text-gray-600">Qty</th>
              <th className="text-right py-3 text-gray-600">Unit price</th>
              <th className="text-right py-3 text-gray-600">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-4">
                {formatApplianceType(labScript.appliance_type)}
                {labScript.arch === 'dual' && " (Dual Arch)"}
              </td>
              <td className="py-4 text-center">1</td>
              <td className="py-4 text-right">
                ${labScript.amount_paid?.toFixed(2)}
              </td>
              <td className="py-4 text-right">
                ${labScript.amount_paid?.toFixed(2)}
              </td>
            </tr>
            {labScript.needs_nightguard === 'yes' && (
              <tr className="border-b border-gray-100">
                <td className="py-4">Additional Nightguard</td>
                <td className="py-4 text-center">1</td>
                <td className="py-4 text-right">Included</td>
                <td className="py-4 text-right">$0.00</td>
              </tr>
            )}
            {labScript.express_design === 'yes' && (
              <tr className="border-b border-gray-100">
                <td className="py-4">Express Design Service</td>
                <td className="py-4 text-center">1</td>
                <td className="py-4 text-right">Included</td>
                <td className="py-4 text-right">$0.00</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200">
              <td colSpan={2}></td>
              <td className="py-4 text-right font-semibold">Subtotal</td>
              <td className="py-4 text-right font-semibold">
                ${labScript.amount_paid?.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colSpan={2}></td>
              <td className="py-4 text-right font-semibold">Total</td>
              <td className="py-4 text-right font-semibold">
                ${labScript.amount_paid?.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colSpan={2}></td>
              <td className="py-4 text-right font-semibold">Amount due</td>
              <td className="py-4 text-right font-semibold">
                ${labScript.amount_paid?.toFixed(2)} USD
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Footer */}
      <div className="text-xs text-gray-500 border-t pt-8">
        <p>{labScript.payment_id} · ${labScript.amount_paid?.toFixed(2)} USD due {format(new Date(), 'MMMM d, yyyy')}</p>
        <p className="mt-1">Page 1 of 1</p>
      </div>
    </div>
  );
};