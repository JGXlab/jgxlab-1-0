import { View, Text } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { styles } from './PDFStyles';
import { Tables } from '@/integrations/supabase/types';

interface PDFHeaderProps {
  labScript: Tables<"lab_scripts">;
}

export const PDFHeader = ({ labScript }: PDFHeaderProps) => (
  <View style={styles.header}>
    <View style={styles.headerContent}>
      <View style={styles.headerLeft}>
        <Text style={styles.title}>Invoice</Text>
        <Text style={styles.subtitle}>Thank you for your business</Text>
        <Text style={styles.paidBadge}>Paid</Text>
        
        <View style={{ marginTop: 16 }}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Invoice No:</Text>
            <Text style={styles.infoValue}>{labScript.payment_id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Issue Date:</Text>
            <Text style={styles.infoValue}>
              {format(new Date(labScript.payment_date || new Date()), 'MMMM d, yyyy')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment Date:</Text>
            <Text style={styles.infoValue}>
              {format(new Date(labScript.payment_date || new Date()), 'MMMM d, yyyy')}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.headerRight}>
        <Text style={styles.companyName}>JGX Dental Lab LLC</Text>
        <Text style={styles.companyInfo}>25 Highview Trail</Text>
        <Text style={styles.companyInfo}>Pittsford, New York 14534</Text>
        <Text style={styles.companyInfo}>United States</Text>
        <Text style={styles.companyInfo}>+1 718-812-2869</Text>
      </View>
    </View>
  </View>
);