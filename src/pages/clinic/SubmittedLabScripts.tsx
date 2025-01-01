import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { Calendar, User, FileText, CheckCircle2, Clock, Info, Database, Eye } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import { EmptyLabScripts } from "@/components/lab-scripts/EmptyLabScripts";
import { LoadingLabScripts } from "@/components/lab-scripts/LoadingLabScripts";
import { LabScriptsHeader } from "@/components/lab-scripts/LabScriptsHeader";
import { Button } from "@/components/ui/button";
import { PreviewLabScriptModal } from "@/components/surgical-form/PreviewLabScriptModal";
import { useState } from "react";

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
  const [selectedScript, setSelectedScript] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

  const handlePreview = (script: any, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click when clicking preview button
    setSelectedScript(script);
    setIsPreviewOpen(true);
  };

  return (
    <ClinicLayout>
      <div className="p-6 space-y-6">
        <LabScriptsHeader />

        <div className="bg-white rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="w-[250px]">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <User className="h-4 w-4" />
                    <span>Patient</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <FileText className="h-4 w-4" />
                    <span>Appliance Details</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Calendar className="h-4 w-4" />
                    <span>Due Date</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Database className="h-4 w-4" />
                    <span>Status</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Clock className="h-4 w-4" />
                    <span>Created</span>
                  </div>
                </TableHead>
                <TableHead className="w-[100px]">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <LoadingLabScripts />
                  </TableCell>
                </TableRow>
              ) : labScripts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <EmptyLabScripts />
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
                          <p className="font-medium text-gray-900">
                            {script.patients?.first_name} {script.patients?.last_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            ID: {script.patient_id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">
                          {getApplianceTypeDisplay(script.appliance_type)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {script.arch.charAt(0).toUpperCase() + script.arch.slice(1)} Arch
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 text-gray-700">
                        <Calendar className="h-4 w-4" />
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
                      <div className="text-sm text-gray-600">
                        {format(new Date(script.created_at), 'MMM d, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={(e) => handlePreview(script, e)}
                      >
                        <Eye className="h-4 w-4" />
                        <span>Preview</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {selectedScript && (
          <PreviewLabScriptModal
            isOpen={isPreviewOpen}
            onClose={() => {
              setIsPreviewOpen(false);
              setSelectedScript(null);
            }}
            formData={selectedScript}
          />
        )}
      </div>
    </ClinicLayout>
  );
}