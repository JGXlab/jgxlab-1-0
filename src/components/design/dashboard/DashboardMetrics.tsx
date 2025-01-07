import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardStatusCards } from "./DashboardStatusCards";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const DashboardMetrics = () => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: labScripts = [], isLoading } = useQuery({
    queryKey: ['dashboardLabScripts'],
    queryFn: async () => {
      console.log('Fetching lab scripts for dashboard metrics...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No user found');
        toast({
          title: "Authentication Error",
          description: "Please sign in to view dashboard metrics",
          variant: "destructive",
        });
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
        toast({
          title: "Error",
          description: "Failed to fetch lab scripts",
          variant: "destructive",
        });
        throw error;
      }

      console.log('Fetched lab scripts:', data);
      return data || [];
    },
    retry: 1,
  });

  // Calculate status counts
  const statusCounts = {
    pending: labScripts.filter(script => script.status === 'pending').length,
    inProgress: labScripts.filter(script => script.status === 'in_progress').length,
    paused: labScripts.filter(script => script.status === 'paused').length,
    onHold: labScripts.filter(script => script.status === 'on_hold').length,
    incomplete: labScripts.filter(script => 
      ['pending', 'in_progress', 'paused', 'on_hold'].includes(script.status)
    ).length,
    completed: labScripts.filter(script => script.status === 'completed').length,
    all: labScripts.length
  };

  if (isLoading) {
    return <div className="animate-pulse bg-gray-100 h-48 rounded-lg" />;
  }

  return (
    <div className="w-full animate-fade-in">
      <DashboardStatusCards stats={statusCounts} />
    </div>
  );
};