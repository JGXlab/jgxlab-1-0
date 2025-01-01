import { ReactNode } from "react";
import { ClinicSidebar } from "./ClinicSidebar";

export function ClinicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <ClinicSidebar />
      <main className="flex-1 bg-gray-50">{children}</main>
    </div>
  );
}