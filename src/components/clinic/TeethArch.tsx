import React, { useState } from 'react';

interface ToothProps {
  number: number;
  position: { x: number; y: number };
  isSelected: boolean;
  onClick: () => void;
}

const Tooth: React.FC<ToothProps> = ({ number, position, isSelected, onClick }) => (
  <div
    className={`absolute cursor-pointer transition-colors ${
      isSelected ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
    }`}
    style={{ left: `${position.x}%`, top: `${position.y}%` }}
    onClick={onClick}
  >
    <div className="w-8 h-8 border-2 rounded-md flex items-center justify-center font-medium">
      {number}
    </div>
  </div>
);

export const TeethArch = () => {
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([]);

  const upperTeeth = [
    { number: 18, x: 10, y: 10 },
    { number: 17, x: 20, y: 8 },
    { number: 16, x: 30, y: 6 },
    { number: 15, x: 40, y: 5 },
    { number: 14, x: 50, y: 4 },
    { number: 13, x: 60, y: 5 },
    { number: 12, x: 70, y: 6 },
    { number: 11, x: 80, y: 8 },
    { number: 21, x: 90, y: 10 },
  ];

  const lowerTeeth = [
    { number: 48, x: 10, y: 80 },
    { number: 47, x: 20, y: 82 },
    { number: 46, x: 30, y: 84 },
    { number: 45, x: 40, y: 85 },
    { number: 44, x: 50, y: 86 },
    { number: 43, x: 60, y: 85 },
    { number: 42, x: 70, y: 84 },
    { number: 41, x: 80, y: 82 },
    { number: 31, x: 90, y: 80 },
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
            number={tooth.number}
            position={{ x: tooth.x, y: tooth.y }}
            isSelected={selectedTeeth.includes(tooth.number)}
            onClick={() => toggleTooth(tooth.number)}
          />
        ))}
        {lowerTeeth.map(tooth => (
          <Tooth
            key={tooth.number}
            number={tooth.number}
            position={{ x: tooth.x, y: tooth.y }}
            isSelected={selectedTeeth.includes(tooth.number)}
            onClick={() => toggleTooth(tooth.number)}
          />
        ))}
      </div>
    </div>
  );
};