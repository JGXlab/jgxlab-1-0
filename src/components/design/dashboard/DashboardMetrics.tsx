import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatusCardsGrid } from "@/components/lab-scripts/StatusCardsGrid";
import { useState } from "react";

export const DashboardMetrics = () => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const { data: labScripts = [], isLoading } = useQuery({
    queryKey: ['dashboardLabScripts'],
    queryFn: async () => {
      console.log('Fetching lab scripts for dashboard metrics...');
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
    <div className="w-full animate-fade-in">
      <StatusCardsGrid 
        statusCounts={statusCounts}
        selectedStatus={selectedStatus}
        onStatusSelect={setSelectedStatus}
      />
    </div>
  );
};