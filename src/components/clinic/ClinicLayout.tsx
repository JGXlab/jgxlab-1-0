import { ReactNode } from "react";
import { ClinicSidebar } from "./ClinicSidebar";

export function ClinicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-[#F8F9FA]">
      <div className="fixed left-0 w-64">
        <ClinicSidebar />
      </div>
      <main className="flex-1 ml-64">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}