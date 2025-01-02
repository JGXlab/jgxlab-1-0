import { ReactNode } from "react";
import { ClinicSidebar } from "./ClinicSidebar";

export function ClinicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-accent/30">
      <div className="flex justify-center">
        <div className="w-full max-w-[1280px] relative">
          <div className="flex">
            <ClinicSidebar />
            <main className="flex-1 pl-64">
              <div className="container p-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}