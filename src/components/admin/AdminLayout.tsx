import { useState } from "react";
import { AdminNavbar } from "./AdminNavbar";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-accent/30 flex relative">
      <AdminNavbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main 
        className={`flex-1 p-3 sm:p-6 transition-all duration-300 ease-spring animate-fade-in ${
          isCollapsed ? 'ml-[45px]' : 'ml-[45px] sm:ml-48'
        }`}
      >
        <div className="max-w-[1280px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};