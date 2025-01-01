import { AdminSidebar } from "./AdminSidebar";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full">
      <AdminSidebar />
      <main className="flex-1 pl-64">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};