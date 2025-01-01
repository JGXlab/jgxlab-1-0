import React from 'react';

export const TeethArch = () => {
  return (
    <div className="relative w-full aspect-[4/3] bg-white rounded-lg border p-4">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg 
          viewBox="0 0 800 600" 
          className="w-full h-full max-w-[600px]"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d="M400 100 C 550 100, 700 200, 700 300 C 700 400, 550 500, 400 500 C 250 500, 100 400, 100 300 C 100 200, 250 100, 400 100"
            fill="none"
            stroke="black"
            strokeWidth="2"
          />
          {/* Add individual teeth paths here if needed */}
        </svg>
      </div>
    </div>
  );
};