import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminNavbar } from "./AdminNavbar";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-white w-full">
      <div className="w-full h-full min-h-screen px-8 md:px-12 lg:px-16 bg-[#d9dfec]">
        <div className="flex flex-col max-w-[1400px] w-full mx-auto h-screen py-8">
          <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
            <AdminNavbar />
            <main className="p-4 sm:p-6 lg:p-8 animate-fade-in">
              {children}
            </main>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};