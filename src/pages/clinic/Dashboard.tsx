import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClinicNavHeader } from "@/components/clinic/ClinicNavHeader";
import { DashboardCharts } from "@/components/design/dashboard/DashboardCharts";
import { DashboardMetrics } from "@/components/design/dashboard/DashboardMetrics";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

export default function ClinicDashboard() {
  const { toast } = useToast();
  
  const { data: labScripts = [], isError } = useQuery({
    queryKey: ['dashboardLabScripts'],
    queryFn: async () => {
      console.log('Fetching lab scripts for dashboard...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No user found');
        throw new Error("No user found");
      }

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
    retry: 1,
    onError: (error) => {
      console.error('Error in lab scripts query:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    }
  });

  if (isError) {
    return (
      <ClinicLayout>
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-red-500">Failed to load dashboard data. Please refresh the page.</p>
        </div>
      </ClinicLayout>
    );
  }

  return (
    <ClinicLayout>
      <div className="flex flex-col max-w-[1400px] w-full mx-auto h-screen py-8">
        <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
          <ClinicNavHeader />
          <TooltipProvider>
            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
              <DashboardMetrics />
              <DashboardCharts labScripts={labScripts} />
            </div>
          </TooltipProvider>
        </ScrollArea>
      </div>
    </ClinicLayout>
  );
}