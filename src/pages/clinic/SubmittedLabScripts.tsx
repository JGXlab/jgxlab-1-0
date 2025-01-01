import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { Button } from "@/components/ui/button";
import { FilePlus, Calendar, User, FileText, CheckCircle2, Clock, Info, Database } from "lucide-react";
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
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'rejected':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'completed':
      return <CheckCircle2 className="h-4 w-4" />;
    case 'rejected':
      return <Info className="h-4 w-4" />;
    default:
      return null;
  }
};

const getApplianceTypeDisplay = (type: string) => {
  return type.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
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
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Lab Scripts</h1>
            <p className="text-sm text-muted-foreground">
              Manage and track your submitted lab scripts
            </p>
          </div>
          <Button 
            onClick={() => navigate("/clinic/new-lab-script")}
            className="bg-primary hover:bg-primary-hover transition-colors"
          >
            <FilePlus className="mr-2 h-4 w-4" />
            New Lab Script
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="w-[250px]">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Patient</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Appliance Details</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Due Date</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span>Status</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Created</span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                      <Clock className="h-5 w-5 animate-spin" />
                      <span>Loading lab scripts...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : labScripts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center space-y-2 text-muted-foreground">
                      <FileText className="h-8 w-8" />
                      <p>No lab scripts found. Create your first one!</p>
                      <Button 
                        variant="outline" 
                        onClick={() => navigate("/clinic/new-lab-script")}
                        className="mt-2"
                      >
                        <FilePlus className="mr-2 h-4 w-4" />
                        Create Lab Script
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                labScripts.map((script: any) => (
                  <TableRow 
                    key={script.id} 
                    className="cursor-pointer hover:bg-gray-50/50 transition-colors"
                    onClick={() => navigate(`/clinic/lab-scripts/${script.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {script.patients?.first_name} {script.patients?.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ID: {script.patient_id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">
                          {getApplianceTypeDisplay(script.appliance_type)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {script.arch.charAt(0).toUpperCase() + script.arch.slice(1)} Arch
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{script.due_date}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={`flex items-center gap-1 w-fit border ${getStatusColor(script.status)}`}
                      >
                        {getStatusIcon(script.status)}
                        <span className="capitalize">{script.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(script.created_at), 'MMM d, yyyy')}
                      </div>
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