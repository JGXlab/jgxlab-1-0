export const formatApplianceType = (type: string) => {
  if (!type) return '';
  return type.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};