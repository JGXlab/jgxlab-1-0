import React from "react";

export function ClinicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] w-full">
      <div className="w-full max-w-[100%] px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}