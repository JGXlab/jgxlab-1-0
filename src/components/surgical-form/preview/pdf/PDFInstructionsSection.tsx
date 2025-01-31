import { View, Text } from '@react-pdf/renderer';
import { styles } from './PDFStyles';

interface PDFInstructionsSectionProps {
  instructions?: string;
}

export const PDFInstructionsSection = ({ instructions }: PDFInstructionsSectionProps) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Specific Instructions</Text>
    <View style={styles.instructionsBox}>
      <Text style={styles.instructionsText}>
        {instructions || 'No specific instructions provided'}
      </Text>
    </View>
  </View>
);