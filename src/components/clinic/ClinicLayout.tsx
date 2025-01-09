import React from "react";

export function ClinicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white w-full">
      <div className="w-full h-full min-h-screen px-8 md:px-12 lg:px-16 bg-[#d9dfec]">
        <div className="flex flex-col max-w-[1400px] w-full mx-auto h-screen py-8">
          {children}
        </div>
      </div>
    </div>
  );
}