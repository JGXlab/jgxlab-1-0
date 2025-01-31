import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    width: '100%',
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
    width: '100%',
    minHeight: 60,
  },
  value: {
    fontSize: 12,
    color: '#111827',
    lineHeight: 1.5,
    flexWrap: 'wrap',
    width: '100%',
  },
  placeholder: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
});

interface PDFInstructionsSectionProps {
  instructions?: string;
}

export const PDFInstructionsSection = ({ instructions }: PDFInstructionsSectionProps) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Specific Instructions</Text>
    <View style={styles.contentBox}>
      {instructions ? (
        <Text style={styles.value}>{instructions}</Text>
      ) : (
        <Text style={styles.placeholder}>No specific instructions provided</Text>
      )}
    </View>
  </View>
);