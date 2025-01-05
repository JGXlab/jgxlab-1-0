import { format } from "date-fns";
import { Tables } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { NIGHTGUARD_PRICE, EXPRESS_DESIGN_PRICE } from "@/components/surgical-form/utils/priceCalculations";

interface InvoiceProps {
  labScript: Tables<"lab_scripts">;
  onDownload?: () => void;
}

export const Invoice = ({ labScript, onDownload }: InvoiceProps) => {
  const { data: invoice, isLoading: isLoadingInvoice } = useQuery({
    queryKey: ['invoice', labScript.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('lab_script_id', labScript.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!labScript.id,
  });

  if (isLoadingInvoice) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted">No invoice found</p>
      </div>
    );
  }

  const formatApplianceType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Calculate subtotal (base price)
  const basePrice = invoice.amount_paid || 0;
  const nightguardPrice = invoice.needs_nightguard === 'yes' ? NIGHTGUARD_PRICE : 0;
  const expressDesignPrice = invoice.express_design === 'yes' ? EXPRESS_DESIGN_PRICE : 0;
  const totalPrice = basePrice + nightguardPrice + expressDesignPrice;

  return (
    <Card className="bg-white w-full max-w-[210mm] mx-auto shadow-none border-none">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoice</h1>
            <div className="mt-4 space-y-1 text-sm text-gray-600">
              <p>Invoice number: {labScript.payment_id}</p>
              <p>Date of issue: {format(new Date(), 'MMMM d, yyyy')}</p>
              <p>Date due: {format(new Date(), 'MMMM d, yyyy')}</p>
              <p className="mt-2">
                Patient: {invoice.patient_name}
              </p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-semibold text-primary">JGX Dental Lab LLC</h2>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-12">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">From</h3>
            <div className="space-y-1 text-gray-600">
              <p>JGX Dental Lab LLC</p>
              <p>25 Highview Trail</p>
              <p>Pittsford, New York 14534</p>
              <p>United States</p>
              <p>+1 718-812-2869</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Bill to</h3>
            <div className="space-y-1 text-gray-600">
              <p>{invoice.clinic_name}</p>
              <p>{invoice.clinic_address}</p>
              <p>{invoice.clinic_phone}</p>
              <p>{invoice.clinic_email}</p>
            </div>
          </div>
        </div>

        {/* Services Table */}
        <div className="mt-8">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-gray-600 font-medium">Description</th>
                <th className="text-center py-3 text-gray-600 font-medium">Qty</th>
                <th className="text-right py-3 text-gray-600 font-medium">Unit price</th>
                <th className="text-right py-3 text-gray-600 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-4 text-gray-900">
                  {formatApplianceType(invoice.appliance_type)}
                  {invoice.arch === 'dual' && " (Dual Arch)"} - 
                  Patient: {invoice.patient_name}
                </td>
                <td className="py-4 text-center text-gray-600">1</td>
                <td className="py-4 text-right text-gray-600">
                  ${basePrice.toFixed(2)}
                </td>
                <td className="py-4 text-right text-gray-900 font-medium">
                  ${basePrice.toFixed(2)}
                </td>
              </tr>
              {invoice.needs_nightguard === 'yes' && (
                <tr>
                  <td className="py-4 text-gray-900">Additional Nightguard</td>
                  <td className="py-4 text-center text-gray-600">1</td>
                  <td className="py-4 text-right text-gray-600">${NIGHTGUARD_PRICE.toFixed(2)}</td>
                  <td className="py-4 text-right text-gray-900 font-medium">${NIGHTGUARD_PRICE.toFixed(2)}</td>
                </tr>
              )}
              {invoice.express_design === 'yes' && (
                <tr>
                  <td className="py-4 text-gray-900">Express Design Service</td>
                  <td className="py-4 text-center text-gray-600">1</td>
                  <td className="py-4 text-right text-gray-600">${EXPRESS_DESIGN_PRICE.toFixed(2)}</td>
                  <td className="py-4 text-right text-gray-900 font-medium">${EXPRESS_DESIGN_PRICE.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
            <tfoot className="border-t border-gray-200">
              <tr>
                <td colSpan={2}></td>
                <td className="py-4 text-right font-medium text-gray-900">Subtotal</td>
                <td className="py-4 text-right font-medium text-gray-900">
                  ${totalPrice.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td colSpan={2}></td>
                <td className="py-4 text-right font-medium text-gray-900">Total</td>
                <td className="py-4 text-right font-medium text-gray-900">
                  ${totalPrice.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td colSpan={2}></td>
                <td className="py-4 text-right font-medium text-gray-900">Amount due</td>
                <td className="py-4 text-right font-medium text-primary">
                  ${totalPrice.toFixed(2)} USD
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </Card>
  );
};