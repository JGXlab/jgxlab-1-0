import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { styles } from './PDFStyles';

interface PDFInstructionsSectionProps {
  instructions?: string;
}

export const PDFInstructionsSection = ({ instructions }: PDFInstructionsSectionProps) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Specific Instructions</Text>
    <View style={styles.instructionsBox}>
      {instructions ? (
        <Text style={styles.instructionsText}>{instructions}</Text>
      ) : (
        <Text style={styles.placeholder}>No specific instructions provided</Text>
      )}
    </View>
  </View>
);