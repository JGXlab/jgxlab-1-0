import { DesignLayout } from "@/components/design/DesignLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { DesignNavbar } from "@/components/design/DesignNavbar";
import { DashboardHeader } from "@/components/design/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/design/dashboard/DashboardStats";
import { EmptyState } from "@/components/design/dashboard/EmptyState";

export default function DesignDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { data: labScripts = [], isLoading } = useQuery({
    queryKey: ['design-dashboard-scripts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lab_scripts')
        .select(`
          *,
          patients (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const pendingScripts = labScripts.filter(script => script.status === 'pending').length;
  const inProgressScripts = labScripts.filter(script => script.status === 'in_progress').length;
  const completedScripts = labScripts.filter(script => script.status === 'completed').length;
  const urgentScripts = labScripts.filter(script => {
    const dueDate = new Date(script.due_date);
    const today = new Date();
    return dueDate <= today && script.status !== 'completed';
  }).length;

  return (
    <DesignLayout>
      <div className="flex flex-col max-w-[1400px] w-full mx-auto h-screen py-8">
        <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
          <DesignNavbar 
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <DashboardStats 
              pendingScripts={pendingScripts}
              inProgressScripts={inProgressScripts}
              urgentScripts={urgentScripts}
              completedScripts={completedScripts}
            />
            <EmptyState />
          </div>
        </ScrollArea>
      </div>
    </DesignLayout>
  );
}