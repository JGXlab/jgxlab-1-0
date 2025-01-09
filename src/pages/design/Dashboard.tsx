import { DesignLayout } from "@/components/design/DesignLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { DashboardCharts } from "@/components/design/dashboard/DashboardCharts";
import { DashboardStatusCards } from "@/components/design/dashboard/DashboardStatusCards";
import { DesignNavbar } from "@/components/design/DesignNavbar";

export default function DesignDashboard() {
  const { data: labScripts = [], isLoading } = useQuery({
    queryKey: ['design-dashboard-scripts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lab_scripts')
        .select(`
          *,
          patients (
            first_name,
            last_name,
            clinics (
              name,
              doctor_name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const stats = {
    pending: labScripts.filter(script => script.status === 'pending').length,
    inProgress: labScripts.filter(script => script.status === 'in_progress').length,
    paused: labScripts.filter(script => script.status === 'paused').length,
    onHold: labScripts.filter(script => script.status === 'on_hold').length,
    incomplete: labScripts.filter(script => 
      ['pending', 'in_progress', 'paused', 'on_hold'].includes(script.status)
    ).length,
    completed: labScripts.filter(script => script.status === 'completed').length,
    all: labScripts.length,
  };

  return (
    <DesignLayout>
      <div className="flex flex-col max-w-[1400px] w-full mx-auto h-screen py-8">
        <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
          <DesignNavbar />
          
          <motion.div 
            className="p-4 sm:p-6 lg:p-8 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TooltipProvider>
              <DashboardStatusCards stats={stats} />
              <DashboardCharts labScripts={labScripts} />
            </TooltipProvider>
          </motion.div>
        </ScrollArea>
      </div>
    </DesignLayout>
  );
}