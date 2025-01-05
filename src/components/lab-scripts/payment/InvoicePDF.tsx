import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from "date-fns";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    color: '#375bdc',
  },
  status: {
    backgroundColor: '#d1fae5',
    padding: '4 8',
    color: '#047857',
    borderRadius: 4,
    fontSize: 10,
    alignSelf: 'flex-start',
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: 100,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
    color: '#4b5563',
  },
  companyInfo: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  col1: {
    flex: 2,
  },
  col2: {
    flex: 1,
    textAlign: 'right',
  },
});

interface InvoicePDFProps {
  labScript: any;
  invoice: any;
}

export const InvoicePDF = ({ labScript, invoice }: InvoicePDFProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Invoice</Text>
          <Text style={styles.status}>Paid</Text>
        </View>

        <View style={styles.section}>
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

        <View style={styles.companyInfo}>
          <Text style={{ fontSize: 16, color: '#375bdc', marginBottom: 8 }}>
            JGX Dental Lab LLC
          </Text>
          <Text>25 Highview Trail</Text>
          <Text>Pittsford, New York 14534</Text>
          <Text>United States</Text>
          <Text>+1 718-812-2869</Text>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>Description</Text>
            <Text style={styles.col2}>Amount</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.col1}>{invoice.appliance_type}</Text>
            <Text style={styles.col2}>${invoice.amount_paid}</Text>
          </View>
          {invoice.needs_nightguard === 'yes' && (
            <View style={styles.tableRow}>
              <Text style={styles.col1}>Night Guard</Text>
              <Text style={styles.col2}>$150.00</Text>
            </View>
          )}
          {invoice.express_design === 'yes' && (
            <View style={styles.tableRow}>
              <Text style={styles.col1}>Express Design</Text>
              <Text style={styles.col2}>$50.00</Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};