import { useState } from "react";
import { AdminNavbar } from "./AdminNavbar";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-accent/30 flex relative w-full">
      <AdminNavbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main 
        className={`flex-1 p-4 sm:p-8 transition-all duration-300 ease-spring animate-fade-in w-full ${
          isCollapsed ? 'ml-[60px]' : 'ml-[60px] sm:ml-64'
        }`}
      >
        {children}
      </main>
    </div>
  );
};