import { format } from "date-fns";
import { Tables } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

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

  // Calculate individual prices based on the total amount
  const totalAmount = invoice.amount_paid || 0;
  const hasNightguard = invoice.needs_nightguard === 'yes';
  const hasExpressDesign = invoice.express_design === 'yes';
  
  // Base price calculation (working backwards from total)
  let basePrice = totalAmount;
  if (hasNightguard) basePrice -= 50; // Subtract nightguard price
  if (hasExpressDesign) basePrice -= 50; // Subtract express design price

  return (
    <Card className="bg-white w-full max-w-[210mm] mx-auto shadow-none border-none">
      <div className="p-8 space-y-8">
        {/* Enhanced Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-4xl font-bold text-gray-900">Invoice</h1>
              <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                Paid
              </div>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p className="font-medium text-gray-900">Invoice Details</p>
              <p>Invoice number: {labScript.payment_id}</p>
              <p>Issue date: {format(new Date(labScript.payment_date || new Date()), 'MMMM d, yyyy')}</p>
              <p>Payment date: {format(new Date(labScript.payment_date || new Date()), 'MMMM d, yyyy')}</p>
            </div>
          </div>
          <div className="text-right space-y-4">
            <h2 className="text-2xl font-semibold text-primary">JGX Dental Lab LLC</h2>
            <div className="text-sm text-gray-600">
              <p>25 Highview Trail</p>
              <p>Pittsford, New York 14534</p>
              <p>United States</p>
              <p>+1 718-812-2869</p>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-12">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Bill From</h3>
            <div className="space-y-1 text-gray-600">
              <p>JGX Dental Lab LLC</p>
              <p>25 Highview Trail</p>
              <p>Pittsford, New York 14534</p>
              <p>United States</p>
              <p>+1 718-812-2869</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Bill To</h3>
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
                <td className="py-4 text-right text-gray-900 font-medium">
                  ${basePrice.toFixed(2)}
                </td>
              </tr>
              {hasNightguard && (
                <tr>
                  <td className="py-4 text-gray-900">Additional Nightguard</td>
                  <td className="py-4 text-center text-gray-600">1</td>
                  <td className="py-4 text-right text-gray-900 font-medium">$50.00</td>
                </tr>
              )}
              {hasExpressDesign && (
                <tr>
                  <td className="py-4 text-gray-900">Express Design Service</td>
                  <td className="py-4 text-center text-gray-600">1</td>
                  <td className="py-4 text-right text-gray-900 font-medium">$50.00</td>
                </tr>
              )}
            </tbody>
            <tfoot className="border-t border-gray-200">
              <tr>
                <td colSpan={2} className="py-4 text-right font-medium text-gray-900">Total</td>
                <td className="py-4 text-right font-medium text-gray-900">
                  ${totalAmount.toFixed(2)}
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="py-4 text-right font-medium text-gray-900">Amount Paid</td>
                <td className="py-4 text-right font-medium text-emerald-600">
                  ${totalAmount.toFixed(2)} USD
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="py-4 text-right font-medium text-gray-900">Balance Due</td>
                <td className="py-4 text-right font-medium text-gray-900">
                  $0.00 USD
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </Card>
  );
};