import { ReactNode, useState } from "react";
import { AdminNavbar } from "./AdminNavbar";

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-accent/30">
      <div className="max-w-[1280px] mx-auto relative flex">
        <AdminNavbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main 
          className={`flex-1 transition-all duration-300 ease-spring animate-fade-in ${
            isCollapsed ? 'ml-[45px]' : 'ml-[45px] sm:ml-48'
          }`}
        >
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};