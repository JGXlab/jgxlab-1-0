import React from "react";

export function ClinicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex justify-center">
      <main className="w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}