import { format } from "date-fns";
import { Tables } from "@/integrations/supabase/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Building2, Phone, Mail, MapPin } from "lucide-react";
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
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-[#9b87f5] bg-clip-text text-transparent">
                  Invoice
                </h1>
                <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold border border-emerald-200">
                  Paid
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Thank you for your business
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium text-gray-900">Invoice No:</span>
                <span className="font-mono">{labScript.payment_id}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium text-gray-900">Issue Date:</span>
                <span>{format(new Date(labScript.payment_date || new Date()), 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium text-gray-900">Payment Date:</span>
                <span>{format(new Date(labScript.payment_date || new Date()), 'MMMM d, yyyy')}</span>
              </div>
            </div>
          </div>
          <div className="text-right space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-primary">JGX Dental Lab LLC</h2>
              <div className="flex flex-col items-end gap-1.5 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>25 Highview Trail</span>
                </div>
                <span>Pittsford, New York 14534</span>
                <span>United States</span>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span>+1 718-812-2869</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-900">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Bill From</h3>
            </div>
            <div className="space-y-1.5 text-sm text-gray-600 pl-7">
              <p className="font-medium text-gray-900">JGX Dental Lab LLC</p>
              <p>25 Highview Trail</p>
              <p>Pittsford, New York 14534</p>
              <p>United States</p>
              <div className="flex items-center gap-2 pt-1">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>+1 718-812-2869</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-900">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Bill To</h3>
            </div>
            <div className="space-y-1.5 text-sm text-gray-600 pl-7">
              <p className="font-medium text-gray-900">{invoice.clinic_name}</p>
              <p>{invoice.clinic_address}</p>
              <div className="flex items-center gap-2 pt-1">
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{invoice.clinic_phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{invoice.clinic_email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Services Table */}
        <div className="mt-8">
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="text-left py-3 px-4 text-gray-600 font-medium text-sm">Description</th>
                  <th className="text-center py-3 px-4 text-gray-600 font-medium text-sm">Qty</th>
                  <th className="text-right py-3 px-4 text-gray-600 font-medium text-sm">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-4 px-4 text-gray-900">
                    {formatApplianceType(invoice.appliance_type)}
                    {invoice.arch === 'dual' && " (Dual Arch)"} - 
                    Patient: {invoice.patient_name}
                  </td>
                  <td className="py-4 px-4 text-center text-gray-600">1</td>
                  <td className="py-4 px-4 text-right text-gray-900 font-medium">
                    ${basePrice.toFixed(2)}
                  </td>
                </tr>
                {hasNightguard && (
                  <tr>
                    <td className="py-4 px-4 text-gray-900">Additional Nightguard</td>
                    <td className="py-4 px-4 text-center text-gray-600">1</td>
                    <td className="py-4 px-4 text-right text-gray-900 font-medium">$50.00</td>
                  </tr>
                )}
                {hasExpressDesign && (
                  <tr>
                    <td className="py-4 px-4 text-gray-900">Express Design Service</td>
                    <td className="py-4 px-4 text-center text-gray-600">1</td>
                    <td className="py-4 px-4 text-right text-gray-900 font-medium">$50.00</td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-gray-50/50">
                <tr className="border-t-2 border-gray-200">
                  <td colSpan={2} className="py-4 px-4 text-right font-medium text-gray-900">Total</td>
                  <td className="py-4 px-4 text-right font-medium text-gray-900">
                    ${totalAmount.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="py-4 px-4 text-right font-medium text-gray-900">Amount Paid</td>
                  <td className="py-4 px-4 text-right font-medium text-emerald-600">
                    ${totalAmount.toFixed(2)} USD
                  </td>
                </tr>
                <tr>
                  <td colSpan={2} className="py-4 px-4 text-right font-medium text-gray-900">Balance Due</td>
                  <td className="py-4 px-4 text-right font-medium text-gray-900">
                    $0.00 USD
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
};