import React from "react";

export function ClinicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
}