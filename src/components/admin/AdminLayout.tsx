import { useState } from "react";
import { AdminNavbar } from "./AdminNavbar";
import { ScrollArea } from "@/components/ui/scroll-area";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex flex-col max-w-[1400px] w-full mx-auto h-screen py-8">
      <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
        <AdminNavbar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main className="p-4 sm:p-6 lg:p-8 animate-fade-in">
          {children}
        </main>
      </ScrollArea>
    </div>
  );
};