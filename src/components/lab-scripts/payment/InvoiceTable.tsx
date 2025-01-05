interface InvoiceTableProps {
  invoice: {
    appliance_type: string;
    arch: string;
    patient_name: string;
    needs_nightguard: string;
    express_design: string;
    amount_paid: number;
  };
}

export const InvoiceTable = ({ invoice }: InvoiceTableProps) => {
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
        </tfoot>
      </table>
    </div>
  );
};