import React from "react";

export function ClinicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] w-full">
      <div className="w-full max-w-[100%] px-8 md:px-12 lg:px-16">
        {children}
      </div>
    </div>
  );
}