import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Calendar, Clock, Building2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function PatientTableHeader() {
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return profile;
    }
  });

  const isClinicPortal = userProfile?.role === 'clinic';

  return (
    <TableHeader className="sticky top-0 bg-white z-20">
      <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-none">
        <TableHead className="text-primary/80 font-semibold">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Patient Name</span>
          </div>
        </TableHead>
        {!isClinicPortal && (
          <TableHead className="text-primary/80 font-semibold">
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Clinic</span>
            </div>
          </TableHead>
        )}
        <TableHead className="text-primary/80 font-semibold">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Gender</span>
          </div>
        </TableHead>
        <TableHead className="text-primary/80 font-semibold">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Date of Birth</span>
          </div>
        </TableHead>
        <TableHead className="text-primary/80 font-semibold">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Created At</span>
          </div>
        </TableHead>
        <TableHead className="text-right text-primary/80 font-semibold">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}