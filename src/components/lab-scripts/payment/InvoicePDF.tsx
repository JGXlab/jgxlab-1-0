import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from "date-fns";
import { Tables } from '@/integrations/supabase/types';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    color: '#375bdc',
    fontWeight: 'bold',
  },
  status: {
    backgroundColor: '#d1fae5',
    padding: '4 8',
    color: '#047857',
    borderRadius: 4,
    fontSize: 10,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: 100,
    color: '#4b5563',
    fontSize: 10,
  },
  value: {
    flex: 1,
    color: '#111827',
    fontSize: 10,
    fontWeight: 'bold',
  },
  billingSection: {
    marginTop: 30,
    flexDirection: 'row',
    gap: 40,
  },
  billingColumn: {
    flex: 1,
  },
  billingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111827',
  },
  billingContent: {
    fontSize: 10,
    color: '#4b5563',
    lineHeight: 1.5,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  table: {
    marginTop: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableHeaderText: {
    color: '#4b5563',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    padding: 12,
  },
  tableCell: {
    fontSize: 10,
    color: '#111827',
  },
  col1: { flex: 2 },
  col2: { width: 80, textAlign: 'center' },
  col3: { width: 100, textAlign: 'right' },
  totalRow: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderTopWidth: 2,
    borderTopColor: '#e2e8f0',
  },
  totalLabel: {
    flex: 1,
    textAlign: 'right',
    paddingRight: 12,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
  },
  totalAmount: {
    width: 100,
    textAlign: 'right',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
  },
  paidRow: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f8fafc',
  },
  paidAmount: {
    width: 100,
    textAlign: 'right',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#059669',
  },
});

interface InvoicePDFProps {
  labScript: Tables<"lab_scripts">;
  invoice: any;
}

export const InvoicePDF = ({ labScript, invoice }: InvoicePDFProps) => {
  const formatApplianceType = (type: string) => {
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const basePrice = invoice.amount_paid - 
    (invoice.needs_nightguard === 'yes' ? 50 : 0) - 
    (invoice.express_design === 'yes' ? 50 : 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Invoice</Text>
          <Text style={styles.status}>Paid</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.row}>
            <Text style={styles.label}>Invoice No:</Text>
            <Text style={styles.value}>{labScript.payment_id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Issue Date:</Text>
            <Text style={styles.value}>
              {format(new Date(labScript.payment_date || new Date()), 'MMMM d, yyyy')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Date:</Text>
            <Text style={styles.value}>
              {format(new Date(labScript.payment_date || new Date()), 'MMMM d, yyyy')}
            </Text>
          </View>
        </View>

        <View style={styles.billingSection}>
          <View style={styles.billingColumn}>
            <Text style={styles.billingTitle}>Bill From</Text>
            <Text style={styles.companyName}>JGX Dental Lab LLC</Text>
            <Text style={styles.billingContent}>25 Highview Trail</Text>
            <Text style={styles.billingContent}>Pittsford, New York 14534</Text>
            <Text style={styles.billingContent}>United States</Text>
            <Text style={styles.billingContent}>+1 718-812-2869</Text>
          </View>
          <View style={styles.billingColumn}>
            <Text style={styles.billingTitle}>Bill To</Text>
            <Text style={styles.companyName}>{invoice.clinic_name}</Text>
            <Text style={styles.billingContent}>{invoice.clinic_address}</Text>
            <Text style={styles.billingContent}>{invoice.clinic_phone}</Text>
            <Text style={styles.billingContent}>{invoice.clinic_email}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, styles.col1]}>Description</Text>
            <Text style={[styles.tableHeaderText, styles.col2]}>Qty</Text>
            <Text style={[styles.tableHeaderText, styles.col3]}>Amount</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.col1]}>
              {formatApplianceType(invoice.appliance_type)}
              {invoice.arch === 'dual' && " (Dual Arch)"} - 
              Patient: {invoice.patient_name}
            </Text>
            <Text style={[styles.tableCell, styles.col2]}>1</Text>
            <Text style={[styles.tableCell, styles.col3]}>${basePrice.toFixed(2)}</Text>
          </View>

          {invoice.needs_nightguard === 'yes' && (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col1]}>Additional Nightguard</Text>
              <Text style={[styles.tableCell, styles.col2]}>1</Text>
              <Text style={[styles.tableCell, styles.col3]}>$50.00</Text>
            </View>
          )}

          {invoice.express_design === 'yes' && (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.col1]}>Express Design Service</Text>
              <Text style={[styles.tableCell, styles.col2]}>1</Text>
              <Text style={[styles.tableCell, styles.col3]}>$50.00</Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>${invoice.amount_paid.toFixed(2)}</Text>
          </View>

          <View style={styles.paidRow}>
            <Text style={styles.totalLabel}>Amount Paid</Text>
            <Text style={styles.paidAmount}>${invoice.amount_paid.toFixed(2)} USD</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};