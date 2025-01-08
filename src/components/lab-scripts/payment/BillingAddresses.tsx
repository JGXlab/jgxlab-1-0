import { Building2, Phone, Mail } from "lucide-react";

interface BillingAddressesProps {
  invoice: {
    clinic_name: string;
    clinic_address: string;
    clinic_phone: string;
    clinic_email: string;
  };
}

const formatPhoneNumber = (phoneNumber: string) => {
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Check if it's a valid 10-digit number
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // If it's not a 10-digit number, return the original
  return phoneNumber;
};

export const BillingAddresses = ({ invoice }: BillingAddressesProps) => {
  return (
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
            <span>{formatPhoneNumber('718-812-2869')}</span>
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
            <span>{formatPhoneNumber(invoice.clinic_phone)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <span>{invoice.clinic_email}</span>
          </div>
        </div>
      </div>
    </div>
  );
};