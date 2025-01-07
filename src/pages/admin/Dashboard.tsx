import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardMetrics } from "@/components/design/dashboard/DashboardMetrics";
import { DashboardCharts } from "@/components/admin/dashboard/DashboardCharts";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function Dashboard() {
  const { data: metrics } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      console.log('Fetching dashboard metrics...');
      
      // Fetch total clinics
      const { count: clinicsCount, error: clinicsError } = await supabase
        .from('clinics')
        .select('*', { count: 'exact', head: true });

      if (clinicsError) {
        console.error('Error fetching clinics count:', clinicsError);
        throw clinicsError;
      }

      // Fetch total patients
      const { count: patientsCount, error: patientsError } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });

      if (patientsError) {
        console.error('Error fetching patients count:', patientsError);
        throw patientsError;
      }

      // Fetch total lab scripts
      const { count: labScriptsCount, error: labScriptsError } = await supabase
        .from('lab_scripts')
        .select('*', { count: 'exact', head: true });

      if (labScriptsError) {
        console.error('Error fetching lab scripts count:', labScriptsError);
        throw labScriptsError;
      }

      // Fetch lab scripts by status
      const { data: statusData, error: statusError } = await supabase
        .from('lab_scripts')
        .select('status');

      if (statusError) {
        console.error('Error fetching lab scripts status:', statusError);
        throw statusError;
      }

      // Count lab scripts by status
      const statusCounts = statusData.reduce((acc: { [key: string]: number }, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      }, {});

      // Transform status counts into chart data
      const chartData = Object.entries(statusCounts).map(([name, value]) => ({
        name,
        value: value as number,
      }));

      console.log('Dashboard metrics:', {
        clinicsCount,
        patientsCount,
        labScriptsCount,
        chartData,
      });

      return {
        clinicsCount: clinicsCount || 0,
        patientsCount: patientsCount || 0,
        labScriptsCount: labScriptsCount || 0,
        chartData,
      };
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-8 p-8">
        <DashboardMetrics metrics={metrics} />
        <DashboardCharts data={metrics?.chartData || []} />
      </div>
    </AdminLayout>
  );
}