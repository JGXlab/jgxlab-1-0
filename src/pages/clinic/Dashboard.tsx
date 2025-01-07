import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClinicNavHeader } from "@/components/clinic/ClinicNavHeader";
import { DashboardCharts } from "@/components/design/dashboard/DashboardCharts";
import { RecentActivity } from "@/components/design/dashboard/RecentActivity";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { StatusCardsGrid } from "@/components/lab-scripts/StatusCardsGrid";

export default function ClinicDashboard() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const { data: labScripts = [] } = useQuery({
    queryKey: ['dashboardLabScripts'],
    queryFn: async () => {
      console.log('Fetching lab scripts for dashboard...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from('lab_scripts')
        .select(`
          *,
          patients (
            first_name,
            last_name
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching lab scripts:', error);
        throw error;
      }

      console.log('Fetched lab scripts:', data);
      return data || [];
    },
  });

  // Calculate status counts
  const statusCounts = {
    new: labScripts.filter(script => script.status === 'pending').length,
    inProcess: labScripts.filter(script => script.status === 'in_progress').length,
    paused: labScripts.filter(script => script.status === 'paused').length,
    onHold: labScripts.filter(script => script.status === 'on_hold').length,
    incomplete: labScripts.filter(script => 
      ['pending', 'in_progress', 'paused', 'on_hold'].includes(script.status)
    ).length,
    completed: labScripts.filter(script => script.status === 'completed').length,
    all: labScripts.length
  };

  return (
    <ClinicLayout>
      <div className="flex flex-col max-w-[1400px] w-full mx-auto h-screen py-8">
        <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
          <ClinicNavHeader />
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Status Cards */}
            <StatusCardsGrid 
              statusCounts={statusCounts}
              selectedStatus={selectedStatus}
              onStatusSelect={setSelectedStatus}
              variant="dashboard"
            />

            {/* Charts */}
            <DashboardCharts labScripts={labScripts} />

            {/* Recent Activity */}
            <RecentActivity labScripts={labScripts} />
          </div>
        </ScrollArea>
      </div>
    </ClinicLayout>
  );
}