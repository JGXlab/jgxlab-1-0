import { Document, Page } from '@react-pdf/renderer';
import { Tables } from '@/integrations/supabase/types';
import { PDFHeader } from './pdf/PDFHeader';
import { PDFBillingAddresses } from './pdf/PDFBillingAddresses';
import { PDFInvoiceTable } from './pdf/PDFInvoiceTable';
import { styles } from './pdf/PDFStyles';

interface InvoicePDFProps {
  labScript: Tables<"lab_scripts">;
  invoice: any;
}

export const InvoicePDF = ({ labScript, invoice }: InvoicePDFProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PDFHeader labScript={labScript} />
        <PDFBillingAddresses invoice={invoice} />
        <PDFInvoiceTable invoice={invoice} />
      </Page>
    </Document>
  );
};