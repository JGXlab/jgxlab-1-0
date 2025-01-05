import { format } from "date-fns";
import { Building2, Phone, Mail, MapPin } from "lucide-react";

interface InvoiceHeaderProps {
  labScript: {
    payment_id: string;
    payment_date: string;
  };
}

export const InvoiceHeader = ({ labScript }: InvoiceHeaderProps) => {
  return (
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
  );
};