import { PreviewField } from "./PreviewField";

interface ApplianceSectionProps {
  applianceType: string;
  arch: string;
  treatmentType: string;
  screwType: string;
  otherScrewType?: string;
  vdoDetails: string;
  needsNightguard: string;
  shade: string;
}

export const ApplianceSection = ({
  applianceType,
  arch,
  treatmentType,
  screwType,
  otherScrewType,
  vdoDetails,
  needsNightguard,
  shade,
}: ApplianceSectionProps) => {
  const formatTreatmentType = (value: string) => {
    if (!value) return 'Not specified';
    if (!value.includes('|')) return value;
    
    const [upper, lower] = value.split('|');
    if (!upper && !lower) return 'Not specified';
    if (upper && lower) return `Upper: ${upper}, Lower: ${lower}`;
    if (upper) return `Upper: ${upper}`;
    return `Lower: ${lower}`;
  };

  const formatApplianceType = (type: string) => {
    if (!type) return 'Not specified';
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Appliance Details</h3>
      <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
        <PreviewField 
          label="Appliance Type" 
          value={formatApplianceType(applianceType)} 
        />
        <PreviewField 
          label="Arch Type" 
          value={arch ? arch.charAt(0).toUpperCase() + arch.slice(1) : 'Not specified'} 
        />
        <PreviewField 
          label="Treatment Type" 
          value={formatTreatmentType(treatmentType)} 
        />
        <PreviewField 
          label="Screw Type" 
          value={screwType === 'others' && otherScrewType 
            ? otherScrewType 
            : screwType || 'Not specified'} 
        />
        <PreviewField 
          label="VDO Details" 
          value={vdoDetails || 'Not specified'} 
        />
        <PreviewField 
          label="Needs Nightguard" 
          value={needsNightguard 
            ? needsNightguard.charAt(0).toUpperCase() + needsNightguard.slice(1)
            : 'Not specified'} 
        />
        <PreviewField 
          label="Shade" 
          value={shade ? shade.toUpperCase() : 'Not specified'} 
        />
      </div>
    </div>
  );
};