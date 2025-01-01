import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { Button } from "@/components/ui/button";
import { FilePlus, Clock, CheckCircle2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const getStatusColor = (status: string) => {
  switch (status) {
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'completed':
      return <CheckCircle2 className="h-4 w-4" />;
    case 'rejected':
      return <XCircle className="h-4 w-4" />;
    default:
      return null;
  }
};

export default function SubmittedLabScripts() {
  const navigate = useNavigate();

  const { data: labScripts = [], isLoading } = useQuery({
    queryKey: ['labScripts'],
    queryFn: async () => {
      console.log('Fetching lab scripts...');
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
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching lab scripts:', error);
        throw error;
      }

      console.log('Fetched lab scripts:', data);
      return data || [];
    },
  });

  return (
    <ClinicLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Lab Scripts</h1>
            <p className="text-sm text-gray-500">Manage your submitted lab scripts</p>
          </div>
          <Button onClick={() => navigate("/clinic/new-lab-script")}>
            <FilePlus className="mr-2 h-4 w-4" />
            New Lab Script
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Appliance Type</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Loading lab scripts...
                  </TableCell>
                </TableRow>
              ) : labScripts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No lab scripts found. Create your first one!
                  </TableCell>
                </TableRow>
              ) : (
                labScripts.map((script: any) => (
                  <TableRow key={script.id} className="cursor-pointer hover:bg-gray-50">
                    <TableCell>
                      {script.patients?.first_name} {script.patients?.last_name}
                    </TableCell>
                    <TableCell className="capitalize">
                      {script.appliance_type.replace(/-/g, ' ')}
                    </TableCell>
                    <TableCell>{script.due_date}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={`flex items-center gap-1 w-fit ${getStatusColor(script.status)}`}
                      >
                        {getStatusIcon(script.status)}
                        <span className="capitalize">{script.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(script.created_at), 'MMM d, yyyy')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </ClinicLayout>
  );
}