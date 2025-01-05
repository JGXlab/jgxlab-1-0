import { Document, Page } from '@react-pdf/renderer';
import { Tables } from '@/integrations/supabase/types';
import { PDFHeader } from './pdf/PDFHeader';
import { PDFBillingAddresses } from './pdf/PDFBillingAddresses';
import { PDFInvoiceTable } from './pdf/PDFInvoiceTable';
import { styles } from './pdf/PDFStyles';

interface InvoicePDFProps {
  labScript: Tables<"lab_scripts">;
  invoice: any | null;
}

export const InvoicePDF = ({ labScript, invoice }: InvoicePDFProps) => {
  // Create a default invoice object if invoice is null
  const safeInvoice = invoice || {
    clinic_name: 'N/A',
    clinic_address: 'N/A',
    clinic_phone: 'N/A',
    clinic_email: 'N/A'
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PDFHeader labScript={labScript} />
        <PDFBillingAddresses invoice={safeInvoice} />
        <PDFInvoiceTable invoice={safeInvoice} />
      </Page>
    </Document>
  );
};