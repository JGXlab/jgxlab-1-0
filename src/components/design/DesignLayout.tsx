import React from "react";

export function DesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white w-full">
      <div className="w-full h-full min-h-screen px-8 md:px-12 lg:px-16 bg-[#d9dfec]">
        {children}
      </div>
    </div>
  );
}