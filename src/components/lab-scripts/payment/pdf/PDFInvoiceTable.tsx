import { View, Text } from '@react-pdf/renderer';
import { styles } from './PDFStyles';

interface PDFInvoiceTableProps {
  invoice: {
    appliance_type: string;
    arch: string;
    patient_name: string;
    needs_nightguard: string;
    express_design: string;
    amount_paid: number;
    discount_amount?: number;
    promo_code?: string;
  };
}

export const PDFInvoiceTable = ({ invoice }: PDFInvoiceTableProps) => {
  const formatApplianceType = (type: string | undefined) => {
    if (!type) return '';
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const totalAmount = invoice?.amount_paid || 0;
  const hasNightguard = invoice?.needs_nightguard === 'yes';
  const hasExpressDesign = invoice?.express_design === 'yes';
  const discountAmount = invoice?.discount_amount || 0;
  
  let basePrice = totalAmount + discountAmount;
  if (hasNightguard) basePrice -= 50;
  if (hasExpressDesign) basePrice -= 50;

  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, styles.col1]}>Description</Text>
        <Text style={[styles.tableHeaderText, styles.col2]}>Qty</Text>
        <Text style={[styles.tableHeaderText, styles.col3]}>Amount</Text>
      </View>
      
      <View style={styles.tableRow}>
        <Text style={[styles.tableCell, styles.col1]}>
          {formatApplianceType(invoice?.appliance_type)}
          {invoice?.arch === 'dual' && " (Dual Arch)"} - 
          Patient: {invoice?.patient_name || 'N/A'}
        </Text>
        <Text style={[styles.tableCell, styles.col2]}>1</Text>
        <Text style={[styles.tableCell, styles.col3]}>${basePrice.toFixed(2)}</Text>
      </View>

      {hasNightguard && (
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.col1]}>Additional Nightguard</Text>
          <Text style={[styles.tableCell, styles.col2]}>1</Text>
          <Text style={[styles.tableCell, styles.col3]}>$50.00</Text>
        </View>
      )}

      {hasExpressDesign && (
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.col1]}>Express Design Service</Text>
          <Text style={[styles.tableCell, styles.col2]}>1</Text>
          <Text style={[styles.tableCell, styles.col3]}>$50.00</Text>
        </View>
      )}

      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalAmount}>${(totalAmount + discountAmount).toFixed(2)}</Text>
        </View>

        {discountAmount > 0 && (
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Discount {invoice?.promo_code ? `(${invoice.promo_code})` : ''}
            </Text>
            <Text style={[styles.totalAmount, styles.discountText]}>
              -${discountAmount.toFixed(2)}
            </Text>
          </View>
        )}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${totalAmount.toFixed(2)} USD</Text>
        </View>
      </View>
    </View>
  );
};