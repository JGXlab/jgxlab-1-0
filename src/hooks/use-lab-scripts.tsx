import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useLabScripts = (selectedStatus: string | null) => {
  const { data: allLabScripts = [], isLoading } = useQuery({
    queryKey: ['labScripts', 'all'],
    queryFn: async () => {
      console.log('Fetching all lab scripts...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from('lab_scripts')
        .select(`
          *,
          patients (
            first_name,
            last_name,
            clinic_id,
            clinics (
              name,
              doctor_name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching lab scripts:', error);
        throw error;
      }

      console.log('Fetched lab scripts:', data);
      return data || [];
    },
  });

  // Define incomplete statuses
  const incompleteStatuses = ['pending', 'in_progress', 'paused', 'on_hold'];

  // Filter lab scripts based on selected status
  const filteredLabScripts = selectedStatus === 'incomplete'
    ? allLabScripts.filter(script => incompleteStatuses.includes(script.status))
    : selectedStatus
      ? allLabScripts.filter(script => script.status === selectedStatus)
      : allLabScripts;

  // Calculate status counts from all lab scripts
  const statusCounts = {
    new: allLabScripts.filter(script => script.status === 'pending').length,
    inProcess: allLabScripts.filter(script => script.status === 'in_progress').length,
    paused: allLabScripts.filter(script => script.status === 'paused').length,
    onHold: allLabScripts.filter(script => script.status === 'on_hold').length,
    incomplete: allLabScripts.filter(script => 
      incompleteStatuses.includes(script.status)
    ).length,
    completed: allLabScripts.filter(script => script.status === 'completed').length,
    all: allLabScripts.length
  };

  return {
    labScripts: filteredLabScripts,
    statusCounts,
    isLoading
  };
};