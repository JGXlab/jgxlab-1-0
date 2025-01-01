import { Document, Page, StyleSheet } from '@react-pdf/renderer';
import { Tables } from '@/integrations/supabase/types';
import { PDFPatientSection } from './pdf/PDFPatientSection';
import { PDFApplianceSection } from './pdf/PDFApplianceSection';
import { PDFInstructionsSection } from './pdf/PDFInstructionsSection';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#375bdc',
  },
});

interface LabScriptPDFProps {
  labScript: Tables<"lab_scripts">;
  patient: Tables<"patients"> | null;
}

export const LabScriptPDF = ({ labScript, patient }: LabScriptPDFProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PDFPatientSection 
          patient={patient}
          createdAt={labScript.created_at}
          dueDate={labScript.due_date}
        />
        <PDFApplianceSection 
          applianceType={labScript.appliance_type}
          arch={labScript.arch}
          treatmentType={labScript.treatment_type}
          screwType={labScript.screw_type || ''}
          otherScrewType={labScript.other_screw_type}
          vdoDetails={labScript.vdo_details || ''}
          needsNightguard={labScript.needs_nightguard || ''}
          shade={labScript.shade || ''}
        />
        <PDFInstructionsSection 
          instructions={labScript.specific_instructions}
        />
      </Page>
    </Document>
  );
};