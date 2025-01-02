import { useState } from "react";
import { DesignNavbar } from "./DesignNavbar";

export const DesignLayout = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-accent/30 flex relative w-full">
      <DesignNavbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main 
        className={`flex-1 p-4 sm:p-8 transition-all duration-300 ease-spring animate-fade-in w-full ${
          isCollapsed ? 'ml-[60px]' : 'ml-[60px] sm:ml-64'
        }`}
      >
        <div className="max-w-[1280px] mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};