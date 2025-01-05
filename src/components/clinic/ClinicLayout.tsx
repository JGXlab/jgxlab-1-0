import { ReactNode } from "react";

interface ClinicLayoutProps {
  children: ReactNode;
}

export function ClinicLayout({ children }: ClinicLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main className="animate-fade-in">
        {children}
      </main>
    </div>
  );
}