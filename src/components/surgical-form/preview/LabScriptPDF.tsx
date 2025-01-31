import { Document, Page } from '@react-pdf/renderer';
import { Tables } from '@/integrations/supabase/types';
import { PDFPatientSection } from './pdf/PDFPatientSection';
import { PDFApplianceSection } from './pdf/PDFApplianceSection';
import { PDFInstructionsSection } from './pdf/PDFInstructionsSection';
import { styles } from './pdf/PDFStyles';

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
          expressDesign={labScript.express_design}
        />
        <PDFInstructionsSection 
          instructions={labScript.specific_instructions}
        />
      </Page>
    </Document>
  );
};