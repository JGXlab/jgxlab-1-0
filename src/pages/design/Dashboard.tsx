import { DesignLayout } from "@/components/design/DesignLayout";
import { DesignNavbar } from "@/components/design/DesignNavbar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DashboardContent } from "@/components/design/dashboard/DashboardContent";

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
    completed: labScripts.filter(script => script.status === 'completed').length,
    urgent: labScripts.filter(script => {
      const dueDate = new Date(script.due_date);
      const today = new Date();
      return dueDate <= today && script.status !== 'completed';
    }).length,
  };

  const handlePreview = (script: any, e: React.MouseEvent) => {
    console.log("Preview script:", script);
  };

  return (
    <DesignLayout>
      <div className="flex flex-col max-w-[1400px] w-full mx-auto h-screen py-8">
        <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
          <DesignNavbar />
          <DashboardContent 
            labScripts={labScripts}
            isLoading={isLoading}
            stats={stats}
            onPreview={handlePreview}
          />
        </ScrollArea>
      </div>
    </DesignLayout>
  );
}