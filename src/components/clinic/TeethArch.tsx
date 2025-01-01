import React, { useState } from 'react';

interface ToothProps {
  number: number;
  position: { x: number; y: number };
  isSelected: boolean;
  onClick: () => void;
  type: 'molar' | 'premolar' | 'canine' | 'incisor';
}

const ToothShape: React.FC<{ type: ToothProps['type'] }> = ({ type }) => {
  switch (type) {
    case 'molar':
      return (
        <path
          d="M2 1C2 1 3.5 1.5 5 1.5C6.5 1.5 8 1 8 1C8 1 8.5 3 8.5 5C8.5 8 7 9.5 5 9.5C3 9.5 1.5 8 1.5 5C1.5 3 2 1 2 1Z"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );
    case 'premolar':
      return (
        <path
          d="M3 1C3 1 4 1.5 5 1.5C6 1.5 7 1 7 1C7 1 7.5 3 7.5 4.5C7.5 7 6.5 8 5 8C3.5 8 2.5 7 2.5 4.5C2.5 3 3 1 3 1Z"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );
    case 'canine':
      return (
        <path
          d="M3.5 1C3.5 1 4.25 1.25 5 1.25C5.75 1.25 6.5 1 6.5 1C6.5 1 7 3 7 4.5C7 6.5 6 7.5 5 7.5C4 7.5 3 6.5 3 4.5C3 3 3.5 1 3.5 1Z"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );
    case 'incisor':
      return (
        <path
          d="M4 1C4 1 4.5 1.25 5 1.25C5.5 1.25 6 1 6 1C6 1 6.25 2.5 6.25 3.5C6.25 5 5.75 6 5 6C4.25 6 3.75 5 3.75 3.5C3.75 2.5 4 1 4 1Z"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );
  }
};

const Tooth: React.FC<ToothProps> = ({ number, position, isSelected, onClick, type }) => {
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
        <svg
          width="30"
          height="30"
          viewBox="0 0 10 10"
          className={`transition-colors ${
            isSelected ? 'stroke-primary fill-primary/20' : 'stroke-gray-400 hover:stroke-gray-600'
          }`}
          strokeWidth="0.5"
        >
          <ToothShape type={type} />
        </svg>
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