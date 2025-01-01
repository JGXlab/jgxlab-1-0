import { View, Text, StyleSheet } from '@react-pdf/renderer';

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
  label: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 12,
    color: '#111827',
    lineHeight: 1.5,
  },
});

interface PDFInstructionsSectionProps {
  instructions?: string;
}

export const PDFInstructionsSection = ({ instructions }: PDFInstructionsSectionProps) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Additional Information</Text>
    <View style={styles.contentBox}>
      <Text style={styles.label}>Specific Instructions</Text>
      <Text style={styles.value}>
        {instructions || 'No specific instructions provided'}
      </Text>
    </View>
  </View>
);