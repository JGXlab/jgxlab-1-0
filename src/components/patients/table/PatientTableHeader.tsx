import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Calendar, Clock, Building2 } from "lucide-react";
import { useLocation } from "react-router-dom";

export function PatientTableHeader() {
  const location = useLocation();
  const isClinicPortal = location.pathname.startsWith('/clinic');

  return (
    <TableHeader>
      <TableRow className="bg-[#F1F0FB]/50 hover:bg-[#F1F0FB]/50 border-none">
        <TableHead className="text-[#6E59A5] font-semibold">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Patient Name</span>
          </div>
        </TableHead>
        {!isClinicPortal && (
          <TableHead className="text-[#6E59A5] font-semibold">
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Clinic</span>
            </div>
          </TableHead>
        )}
        <TableHead className="text-[#6E59A5] font-semibold">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Gender</span>
          </div>
        </TableHead>
        <TableHead className="text-[#6E59A5] font-semibold">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Date of Birth</span>
          </div>
        </TableHead>
        <TableHead className="text-[#6E59A5] font-semibold">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Created At</span>
          </div>
        </TableHead>
        <TableHead className="text-right text-[#6E59A5] font-semibold">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}