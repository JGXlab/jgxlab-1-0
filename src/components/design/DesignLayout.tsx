import React from "react";

export function DesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
      <div className="w-full h-full min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 bg-[#d9dfec] overflow-x-hidden">
        <div className="flex flex-col max-w-[1400px] w-full mx-auto min-h-screen py-8 relative">
          {children}
        </div>
      </div>
    </div>
  );
}