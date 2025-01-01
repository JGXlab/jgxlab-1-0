import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Bell, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingLabScripts } from "@/components/lab-scripts/LoadingLabScripts";
import { EmptyLabScripts } from "@/components/lab-scripts/EmptyLabScripts";
import { format } from "date-fns";

const LabScripts = () => {
  const { data: labScripts, isLoading } = useQuery({
    queryKey: ['admin-lab-scripts'],
    queryFn: async () => {
      console.log('Fetching lab scripts...');
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
      return data;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Lab Scripts</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search lab scripts..."
              className="pl-10 pr-4 w-64"
            />
          </div>
          <button className="p-2 relative">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <Button variant="outline" className="bg-primary/5 text-primary hover:bg-primary/10">
          All Scripts
        </Button>
        <Button variant="ghost">Pending</Button>
        <Button variant="ghost">Completed</Button>
      </div>

      <Card className="p-6">
        {isLoading ? (
          <LoadingLabScripts />
        ) : !labScripts?.length ? (
          <EmptyLabScripts />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Treatment Type</TableHead>
                <TableHead>Appliance Type</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {labScripts.map((script) => (
                <TableRow key={script.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {script.patients?.first_name} {script.patients?.last_name}
                  </TableCell>
                  <TableCell>{script.treatment_type}</TableCell>
                  <TableCell>{script.appliance_type}</TableCell>
                  <TableCell>{script.due_date}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(script.status)}>
                      {script.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {format(new Date(script.created_at), 'MMM d, yyyy')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </AdminLayout>
  );
};

export default LabScripts;