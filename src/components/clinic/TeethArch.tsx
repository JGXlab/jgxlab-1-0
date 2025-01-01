import React from 'react';

export const TeethArch = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
        <path d="M400 100 C 300 100, 100 200, 100 300 C 100 400, 300 500, 400 500 C 500 500, 700 400, 700 300 C 700 200, 500 100, 400 100" 
          fill="none" 
          stroke="black" 
          strokeWidth="2"
        />
        {/* Individual teeth paths */}
        {/* Upper teeth */}
        <path d="M380 120 L420 120 L410 150 L390 150 Z" fill="white" stroke="black" />
        <path d="M340 130 L380 130 L370 160 L350 160 Z" fill="white" stroke="black" />
        <path d="M420 130 L460 130 L450 160 L430 160 Z" fill="white" stroke="black" />
        {/* Lower teeth */}
        <path d="M380 450 L420 450 L410 480 L390 480 Z" fill="white" stroke="black" />
        <path d="M340 440 L380 440 L370 470 L350 470 Z" fill="white" stroke="black" />
        <path d="M420 440 L460 440 L450 470 L430 470 Z" fill="white" stroke="black" />
      </svg>
    </div>
  );
};