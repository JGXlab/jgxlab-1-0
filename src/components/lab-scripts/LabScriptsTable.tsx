import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, FileText, CheckCircle2, Clock, Info, Database, Eye, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { EmptyLabScripts } from "./EmptyLabScripts";
import { LoadingLabScripts } from "./LoadingLabScripts";
import { useToast } from "@/hooks/use-toast";

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

interface LabScriptsTableProps {
  labScripts: any[];
  isLoading: boolean;
  onPreview: (script: any, e: React.MouseEvent) => void;
  onStatusUpdate?: (id: string, status: string) => void;
}

export function LabScriptsTable({ labScripts, isLoading, onPreview, onStatusUpdate }: LabScriptsTableProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePayment = async (script: any, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Processing payment for lab script:', script.id);
    
    try {
      const response = await fetch('/functions/v1/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData: script,
          lineItems: [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: `Lab Script - ${getApplianceTypeDisplay(script.appliance_type)}`,
                  description: `Lab Script for ${script.patients?.first_name} ${script.patients?.last_name}`,
                },
                unit_amount: 10000, // $100.00
              },
              quantity: 1,
            },
          ],
          applianceType: script.appliance_type,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: "Failed to process payment. Please try again.",
      });
    }
  };

  return (
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
          <TableHead className="w-[180px]">
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
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={(e) => onPreview(script, e)}
                  >
                    <Eye className="h-4 w-4" />
                    <span>Preview</span>
                  </Button>
                  {script.payment_status === 'unpaid' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={(e) => handlePayment(script, e)}
                    >
                      <DollarSign className="h-4 w-4" />
                      <span>Pay</span>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}