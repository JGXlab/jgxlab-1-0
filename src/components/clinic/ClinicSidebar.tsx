import { ClinicLogo } from "./ClinicLogo";
import { ClinicSidebarButtons } from "./ClinicSidebarButtons";

export const ClinicSidebar = () => {
  return (
    <div className="flex flex-col w-64 h-screen bg-white border-r border-gray-100">
      <ClinicLogo />
      <div className="flex-1 overflow-y-auto py-4">
        <ClinicSidebarButtons />
      </div>
    </div>
  );
};