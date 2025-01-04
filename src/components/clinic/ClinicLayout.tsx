import React from "react";

export function ClinicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="w-full max-w-[1400px] px-4 sm:px-6 lg:px-8 mx-auto">
        {children}
      </div>
    </div>
  );
}