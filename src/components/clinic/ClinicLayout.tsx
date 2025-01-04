import React from "react";

export function ClinicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-[1200px] min-h-screen">
        {children}
      </main>
    </div>
  );
}