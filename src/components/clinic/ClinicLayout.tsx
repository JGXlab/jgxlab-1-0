import { ReactNode } from "react";
import { ClinicSidebar } from "./ClinicSidebar";

export function ClinicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-[#F8F9FA]">
      <ClinicSidebar />
      <main className="flex-1 pl-64">
        <div className="container mx-auto py-8 px-4">
          {children}
        </div>
      </main>
    </div>
  );
}