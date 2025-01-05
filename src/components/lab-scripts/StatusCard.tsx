interface StatusCardProps {
  label: string;
  count: number;
  color: string;
  isHighlighted?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

export const StatusCard = ({ 
  label, 
  count, 
  color, 
  isHighlighted = false,
  isSelected = false,
  onClick 
}: StatusCardProps) => (
  <div 
    className={`
      rounded-full px-4 py-1.5 cursor-pointer transition-all duration-300
      hover:shadow-md hover:-translate-y-0.5 flex-shrink-0
      ${color} ${isSelected ? 'ring-1 ring-[#9b87f5] shadow-sm' : ''}
      ${isHighlighted ? 'border border-[#9b87f5]' : ''}
    `}
    onClick={onClick}
  >
    <div className="flex items-center gap-2 whitespace-nowrap">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{count}</span>
    </div>
  </div>
);