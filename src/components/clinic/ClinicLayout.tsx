import { ReactNode } from "react";
import { ClinicSidebar } from "./ClinicSidebar";

export function ClinicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-accent/30">
      <div className="flex">
        <ClinicSidebar />
        <main className="flex-1 pl-64">
          <div className="container mx-auto max-w-[1000px] p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}