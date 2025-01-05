import { View, Text } from '@react-pdf/renderer';
import { styles } from './PDFStyles';

interface BillingAddressesProps {
  invoice: {
    clinic_name: string;
    clinic_address: string;
    clinic_phone: string;
    clinic_email: string;
  };
}

export const PDFBillingAddresses = ({ invoice }: BillingAddressesProps) => {
  // Ensure we have safe values even if some properties are undefined
  const {
    clinic_name = 'N/A',
    clinic_address = 'N/A',
    clinic_phone = 'N/A',
    clinic_email = 'N/A'
  } = invoice || {};

  return (
    <View style={styles.billingSection}>
      <View style={styles.billingColumn}>
        <Text style={styles.billingTitle}>Bill From</Text>
        <View style={styles.billingContent}>
          <Text style={{ color: '#0f172a', marginBottom: 4 }}>JGX Dental Lab LLC</Text>
          <Text>25 Highview Trail</Text>
          <Text>Pittsford, New York 14534</Text>
          <Text>United States</Text>
          <Text style={{ marginTop: 4 }}>+1 718-812-2869</Text>
        </View>
      </View>
      
      <View style={styles.billingColumn}>
        <Text style={styles.billingTitle}>Bill To</Text>
        <View style={styles.billingContent}>
          <Text style={{ color: '#0f172a', marginBottom: 4 }}>{clinic_name}</Text>
          <Text>{clinic_address}</Text>
          <Text style={{ marginTop: 4 }}>{clinic_phone}</Text>
          <Text>{clinic_email}</Text>
        </View>
      </View>
    </View>
  );
};