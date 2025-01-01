import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { Tables } from '@/integrations/supabase/types';
import { PDFPreviewField } from './PDFPreviewField';

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
    color: '#111827',
    fontWeight: 'bold',
  },
  contentBox: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 4,
  },
  grid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  column: {
    width: '50%',
  },
});

interface PDFPatientSectionProps {
  patient: Tables<"patients"> | null;
  createdAt: string;
  dueDate: string;
}

export const PDFPatientSection = ({ patient, createdAt, dueDate }: PDFPatientSectionProps) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Patient Information</Text>
    <View style={styles.contentBox}>
      <View style={styles.grid}>
        <View style={styles.column}>
          <PDFPreviewField 
            label="Patient Name"
            value={patient ? `${patient.first_name} ${patient.last_name}` : 'Loading...'}
          />
        </View>
        <View style={styles.column}>
          <PDFPreviewField 
            label="Gender"
            value={patient?.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'Loading...'}
          />
        </View>
        <View style={styles.column}>
          <PDFPreviewField 
            label="Submitted Date"
            value={format(new Date(createdAt), 'MMM d, yyyy')}
          />
        </View>
        <View style={styles.column}>
          <PDFPreviewField 
            label="Due Date"
            value={dueDate}
          />
        </View>
      </View>
    </View>
  </View>
);