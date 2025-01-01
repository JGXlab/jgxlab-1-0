import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 4,
  },
  value: {
    fontSize: 12,
    color: '#111827',
    fontWeight: 'medium',
  },
});

interface PDFPreviewFieldProps {
  label: string;
  value: string;
}

export const PDFPreviewField = ({ label, value }: PDFPreviewFieldProps) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value || 'Not specified'}</Text>
  </View>
);