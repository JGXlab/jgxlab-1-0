import { ReactNode } from "react";
import { ClinicSidebar } from "./ClinicSidebar";

export function ClinicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <ClinicSidebar />
      <main className="flex-1 pl-64">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}