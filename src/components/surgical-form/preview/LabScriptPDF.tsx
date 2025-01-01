import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { Tables } from '@/integrations/supabase/types';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#375bdc',
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#375bdc',
    fontWeight: 'bold',
  },
  fieldGroup: {
    marginBottom: 15,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#f8fafc',
  },
  field: {
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    color: '#1e293b',
  },
  instructions: {
    whiteSpace: 'pre-wrap',
    fontSize: 12,
    color: '#1e293b',
    lineHeight: 1.5,
  },
});

interface LabScriptPDFProps {
  labScript: Tables<"lab_scripts">;
  patient: Tables<"patients"> | null;
}

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

export const LabScriptPDF = ({ labScript, patient }: LabScriptPDFProps) => {
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Lab Script Details</Text>

        {/* Patient Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Information</Text>
          <View style={styles.fieldGroup}>
            <View style={styles.field}>
              <Text style={styles.label}>Patient Name</Text>
              <Text style={styles.value}>
                {patient ? `${patient.first_name} ${patient.last_name}` : 'Loading...'}
              </Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Gender</Text>
              <Text style={styles.value}>
                {patient?.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : 'Loading...'}
              </Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Submitted Date</Text>
              <Text style={styles.value}>
                {format(new Date(labScript.created_at), 'MMM d, yyyy')}
              </Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Due Date</Text>
              <Text style={styles.value}>{labScript.due_date || 'Not specified'}</Text>
            </View>
          </View>
        </View>

        {/* Appliance Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appliance Details</Text>
          <View style={styles.fieldGroup}>
            <View style={styles.field}>
              <Text style={styles.label}>Appliance Type</Text>
              <Text style={styles.value}>
                {labScript.appliance_type.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Arch Type</Text>
              <Text style={styles.value}>
                {labScript.arch.charAt(0).toUpperCase() + labScript.arch.slice(1)}
              </Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Treatment Type</Text>
              <Text style={styles.value}>{formatTreatmentType(labScript.treatment_type)}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Screw Type</Text>
              <Text style={styles.value}>
                {labScript.screw_type 
                  ? (labScript.screw_type === 'others' && labScript.other_screw_type
                    ? labScript.other_screw_type
                    : screwTypeMap[labScript.screw_type as keyof typeof screwTypeMap] || labScript.screw_type)
                  : 'Not specified'}
              </Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>VDO Details</Text>
              <Text style={styles.value}>
                {labScript.vdo_details 
                  ? vdoDetailsMap[labScript.vdo_details as keyof typeof vdoDetailsMap] || labScript.vdo_details
                  : 'Not specified'}
              </Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Needs Nightguard</Text>
              <Text style={styles.value}>
                {labScript.needs_nightguard
                  ? labScript.needs_nightguard.charAt(0).toUpperCase() + labScript.needs_nightguard.slice(1)
                  : 'Not specified'}
              </Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Shade</Text>
              <Text style={styles.value}>
                {labScript.shade ? labScript.shade.toUpperCase() : 'Not specified'}
              </Text>
            </View>
          </View>
        </View>

        {/* Additional Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          <View style={styles.fieldGroup}>
            <View style={styles.field}>
              <Text style={styles.label}>Specific Instructions</Text>
              <Text style={styles.instructions}>
                {labScript.specific_instructions || 'No specific instructions provided'}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};