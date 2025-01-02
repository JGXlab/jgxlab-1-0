import { ReactNode, useState } from "react";
import { DesignNavbar } from "./DesignNavbar";

export const DesignLayout = ({ children }: { children: ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-accent/30">
      <div className="max-w-[1280px] mx-auto relative flex">
        <DesignNavbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main 
          className={`flex-1 transition-all duration-300 ease-spring animate-fade-in ${
            isCollapsed ? 'ml-[60px]' : 'ml-[60px] sm:ml-64'
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

export default DesignLayout;