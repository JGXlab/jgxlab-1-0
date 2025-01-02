import { ReactNode } from "react";
import { ClinicSidebar } from "./ClinicSidebar";

export function ClinicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <ClinicSidebar />
      <main className="flex-1 pl-64">
        <div className="container py-8">
          {children}
        </div>
      </main>
    </div>
  );
}