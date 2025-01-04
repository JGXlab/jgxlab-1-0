import React from "react";

export function ClinicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex justify-center">
      <main className="w-[1200px]">
        {children}
      </main>
    </div>
  );
}