import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import { DashboardStatusCards } from "@/components/design/dashboard/DashboardStatusCards";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardCharts } from "@/components/admin/dashboard/DashboardCharts";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        console.log("No user found, redirecting to login");
        navigate("/admin/login");
        return;
      }

      console.log("User authenticated:", user.id);
    };

    checkAuth();
  }, [navigate]);

  // Fetch lab scripts data
  const { data: labScripts = [], isLoading } = useQuery({
    queryKey: ['dashboardLabScripts'],
    queryFn: async () => {
      console.log('Fetching lab scripts for dashboard...');
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

      if (error) {
        console.error('Error fetching lab scripts:', error);
        throw error;
      }

      console.log('Fetched lab scripts:', data);
      return data || [];
    },
  });

  // Calculate status counts for the status cards
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

  // Calculate status counts for the pie chart
  const statusCountsForPieChart = labScripts.reduce((acc, script) => {
    acc[script.status] = (acc[script.status] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = Object.entries(statusCountsForPieChart).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
  }));

  // Calculate daily submissions for the line chart
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, 'MMM dd');
  }).reverse();

  const dailySubmissions = last30Days.map(date => {
    const count = labScripts.filter(script => 
      format(new Date(script.created_at), 'MMM dd') === date
    ).length;
    return { date, count };
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <TooltipProvider>
          {/* Status Cards */}
          <DashboardStatusCards stats={statusCounts} />

          {/* Charts */}
          <DashboardCharts 
            dailySubmissions={dailySubmissions}
            pieChartData={pieChartData}
          />
        </TooltipProvider>
      </div>
    </AdminLayout>
  );
}