import { View, Text, StyleSheet } from '@react-pdf/renderer';
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
    marginBottom: 8,
  },
});

const vdoDetailsMap = {
  'open_4mm_no_call': 'Open upto 4 mm without calling Doctor',
  'open_4mm_with_call': 'Open upto 4 mm with calling Doctor',
  'open_vdo_requirement': 'Open VDO based on requirement',
  'no_changes': 'No changes required in VDO'
};

const screwTypeMap = {
  'dc': 'DC Screw',
  'rosen': 'Rosen',
  'powerball': 'Powerball',
  'dess': 'Dess',
  'sin': 'SIN',
  'neodent': 'Neodent',
  'others': 'Others'
};

interface PDFApplianceSectionProps {
  applianceType: string;
  arch: string;
  treatmentType: string;
  screwType: string;
  otherScrewType?: string;
  vdoDetails: string;
  needsNightguard: string;
  shade: string;
  expressDesign?: string; // Added this prop to match the interface
}

export const PDFApplianceSection = ({
  applianceType,
  arch,
  treatmentType,
  screwType,
  otherScrewType,
  vdoDetails,
  needsNightguard,
  shade,
  expressDesign,
}: PDFApplianceSectionProps) => {
  const formatTreatmentType = (value: string) => {
    if (!value) return 'Not specified';
    if (!value.includes('|')) return value;
    
    const [upper, lower] = value.split('|');
    if (!upper && !lower) return 'Not specified';
    
    const formatArch = (arch: string) => 
      arch.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    let result = '';
    if (upper) result += `Upper: ${formatArch(upper)}`;
    if (upper && lower) result += '\n';
    if (lower) result += `Lower: ${formatArch(lower)}`;
    return result;
  };

  const formatApplianceType = (type: string) => {
    if (!type) return 'Not specified';
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Appliance Details</Text>
      <View style={styles.contentBox}>
        <View style={styles.grid}>
          <View style={styles.column}>
            <PDFPreviewField 
              label="Appliance Type"
              value={formatApplianceType(applianceType)}
            />
          </View>
          <View style={styles.column}>
            <PDFPreviewField 
              label="Arch Type"
              value={arch ? arch.charAt(0).toUpperCase() + arch.slice(1) : 'Not specified'}
            />
          </View>
          <View style={styles.column}>
            <PDFPreviewField 
              label="Treatment Type"
              value={formatTreatmentType(treatmentType)}
            />
          </View>
          <View style={styles.column}>
            <PDFPreviewField 
              label="Screw Type"
              value={screwType === 'others' && otherScrewType
                ? otherScrewType
                : screwTypeMap[screwType as keyof typeof screwTypeMap] || 'Not specified'}
            />
          </View>
          <View style={styles.column}>
            <PDFPreviewField 
              label="VDO Details"
              value={vdoDetailsMap[vdoDetails as keyof typeof vdoDetailsMap] || 'Not specified'}
            />
          </View>
          <View style={styles.column}>
            <PDFPreviewField 
              label="Needs Nightguard"
              value={needsNightguard
                ? needsNightguard.charAt(0).toUpperCase() + needsNightguard.slice(1)
                : 'Not specified'}
            />
          </View>
          <View style={styles.column}>
            <PDFPreviewField 
              label="Shade"
              value={shade ? shade.toUpperCase() : 'Not specified'}
            />
          </View>
          {expressDesign && (
            <View style={styles.column}>
              <PDFPreviewField 
                label="Express Design"
                value={expressDesign.charAt(0).toUpperCase() + expressDesign.slice(1)}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};