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
    if (upper && lower) return `Upper: ${upper.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}, Lower: ${lower.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`;
    if (upper) return `Upper: ${upper.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`;
    return `Lower: ${lower.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`;
  };

  const formatApplianceType = (type: string) => {
    if (!type) return 'Not specified';
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatScrewType = (type: string, otherValue?: string) => {
    if (!type) return 'Not specified';
    if (type === 'others' && otherValue) return otherValue;
    return screwTypeMap[type as keyof typeof screwTypeMap] || type;
  };

  const formatVDODetails = (details: string) => {
    if (!details) return 'Not specified';
    return vdoDetailsMap[details as keyof typeof vdoDetailsMap] || details;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Appliance Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50/50 rounded-lg border border-gray-200">
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
          value={formatScrewType(screwType, otherScrewType)} 
        />
        <PreviewField 
          label="VDO Details" 
          value={formatVDODetails(vdoDetails)} 
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