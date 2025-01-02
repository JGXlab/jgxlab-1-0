import { ReactNode } from "react";
import { ClinicSidebar } from "./ClinicSidebar";

export function ClinicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-accent/30">
      <div className="max-w-[1280px] mx-auto relative flex">
        <ClinicSidebar />
        <main className="flex-1 pl-64">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}