import React from "react";

export function ClinicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="w-full max-w-[1400px] mx-auto">
        {children}
      </main>
    </div>
  );
}