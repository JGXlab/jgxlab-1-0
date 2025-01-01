import React, { useState } from 'react';

interface ToothProps {
  number: number;
  position: { x: number; y: number };
  isSelected: boolean;
  onClick: () => void;
  type: 'molar' | 'premolar' | 'canine' | 'incisor';
}

const Tooth: React.FC<ToothProps> = ({ number, position, isSelected, onClick }) => {
  const numberPosition = {
    x: position.x < 50 ? position.x - 8 : position.x + 8,
    y: position.y
  };

  return (
    <>
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
        style={{ left: `${position.x}%`, top: `${position.y}%` }}
        onClick={onClick}
      >
        <div className={`w-8 h-8 transition-colors ${
          isSelected ? 'text-primary fill-primary/20' : 'text-gray-400 hover:text-gray-600'
        }`}>
          <img 
            src="/teeth.svg" 
            alt={`Tooth ${number}`}
            className={`w-full h-full ${isSelected ? 'filter-primary' : ''}`}
          />
        </div>
      </div>
      <div
        className={`absolute text-sm ${
          position.x < 50 ? 'text-right -translate-x-full pr-2' : 'text-left translate-x-0 pl-2'
        } transform -translate-y-1/2`}
        style={{ left: `${numberPosition.x}%`, top: `${numberPosition.y}%` }}
      >
        <span className={`${isSelected ? 'text-primary' : 'text-gray-400'}`}>{number}</span>
      </div>
    </>
  );
};

export const TeethArch = () => {
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([]);

  const upperTeeth = [
    { number: 18, position: { x: 15, y: 25 }, type: 'molar' as const },
    { number: 17, position: { x: 20, y: 20 }, type: 'molar' as const },
    { number: 16, position: { x: 25, y: 15 }, type: 'molar' as const },
    { number: 15, position: { x: 30, y: 12 }, type: 'premolar' as const },
    { number: 14, position: { x: 35, y: 10 }, type: 'premolar' as const },
    { number: 13, position: { x: 40, y: 8 }, type: 'canine' as const },
    { number: 12, position: { x: 45, y: 7 }, type: 'incisor' as const },
    { number: 11, position: { x: 48, y: 6 }, type: 'incisor' as const },
    { number: 21, position: { x: 52, y: 6 }, type: 'incisor' as const },
    { number: 22, position: { x: 55, y: 7 }, type: 'incisor' as const },
    { number: 23, position: { x: 60, y: 8 }, type: 'canine' as const },
    { number: 24, position: { x: 65, y: 10 }, type: 'premolar' as const },
    { number: 25, position: { x: 70, y: 12 }, type: 'premolar' as const },
    { number: 26, position: { x: 75, y: 15 }, type: 'molar' as const },
    { number: 27, position: { x: 80, y: 20 }, type: 'molar' as const },
    { number: 28, position: { x: 85, y: 25 }, type: 'molar' as const },
  ];

  const lowerTeeth = [
    { number: 48, position: { x: 15, y: 75 }, type: 'molar' as const },
    { number: 47, position: { x: 20, y: 80 }, type: 'molar' as const },
    { number: 46, position: { x: 25, y: 85 }, type: 'molar' as const },
    { number: 45, position: { x: 30, y: 88 }, type: 'premolar' as const },
    { number: 44, position: { x: 35, y: 90 }, type: 'premolar' as const },
    { number: 43, position: { x: 40, y: 92 }, type: 'canine' as const },
    { number: 42, position: { x: 45, y: 93 }, type: 'incisor' as const },
    { number: 41, position: { x: 48, y: 94 }, type: 'incisor' as const },
    { number: 31, position: { x: 52, y: 94 }, type: 'incisor' as const },
    { number: 32, position: { x: 55, y: 93 }, type: 'incisor' as const },
    { number: 33, position: { x: 60, y: 92 }, type: 'canine' as const },
    { number: 34, position: { x: 65, y: 90 }, type: 'premolar' as const },
    { number: 35, position: { x: 70, y: 88 }, type: 'premolar' as const },
    { number: 36, position: { x: 75, y: 85 }, type: 'molar' as const },
    { number: 37, position: { x: 80, y: 80 }, type: 'molar' as const },
    { number: 38, position: { x: 85, y: 75 }, type: 'molar' as const },
  ];

  const toggleTooth = (toothNumber: number) => {
    setSelectedTeeth(prev =>
      prev.includes(toothNumber)
        ? prev.filter(n => n !== toothNumber)
        : [...prev, toothNumber]
    );
  };

  return (
    <div className="relative w-full aspect-[4/3] bg-white rounded-lg border p-4">
      <div className="absolute inset-0">
        {upperTeeth.map(tooth => (
          <Tooth
            key={tooth.number}
            {...tooth}
            isSelected={selectedTeeth.includes(tooth.number)}
            onClick={() => toggleTooth(tooth.number)}
          />
        ))}
        {lowerTeeth.map(tooth => (
          <Tooth
            key={tooth.number}
            {...tooth}
            isSelected={selectedTeeth.includes(tooth.number)}
            onClick={() => toggleTooth(tooth.number)}
          />
        ))}
      </div>
    </div>
  );
};
