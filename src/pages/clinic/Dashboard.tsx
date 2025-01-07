import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClinicNavHeader } from "@/components/clinic/ClinicNavHeader";
import { DashboardCharts } from "@/components/design/dashboard/DashboardCharts";
import { DashboardMetrics } from "@/components/design/dashboard/DashboardMetrics";
import { RecentActivity } from "@/components/design/dashboard/RecentActivity";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function ClinicDashboard() {
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

  return (
    <ClinicLayout>
      <div className="flex flex-col max-w-[1400px] w-full mx-auto h-screen py-8">
        <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
          <ClinicNavHeader />
          <TooltipProvider>
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Status Cards */}
              <DashboardMetrics />

              {/* Charts */}
              <DashboardCharts labScripts={labScripts} />

              {/* Recent Activity */}
              <RecentActivity labScripts={labScripts} />
            </div>
          </TooltipProvider>
        </ScrollArea>
      </div>
    </ClinicLayout>
  );
}