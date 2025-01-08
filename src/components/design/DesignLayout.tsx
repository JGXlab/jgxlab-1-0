import React from "react";

export function DesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F1F0FB] w-full">
      <div className="w-full h-full min-h-screen px-8 md:px-12 lg:px-16 py-8 bg-gradient-to-br from-[#F1F9FF] to-[#E5F3FF]">
        {children}
      </div>
    </div>
  );
}