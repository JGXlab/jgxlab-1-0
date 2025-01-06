import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import { format } from "date-fns";
import { getStatusColor, getPaymentStatusColor } from "./utils/statusStyles";
import { StatusUpdateButtons } from "./StatusUpdateButtons";
import { PatientInfo } from "./table/PatientInfo";
import { LabScriptActions } from "./table/LabScriptActions";
import { PreviewLabScriptModal } from "@/components/surgical-form/PreviewLabScriptModal";
import { useState } from "react";

interface TableRowContentProps {
  script: any;
  onPreview: (script: any, e: React.MouseEvent) => void;
  onStatusUpdate?: (id: string, status: string) => void;
  isDesignPortal?: boolean;
  hideClinicColumn?: boolean;
}

export const TableRowContent = ({ 
  script, 
  onPreview, 
  onStatusUpdate,
  isDesignPortal = false,
  hideClinicColumn = false
}: TableRowContentProps) => {
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  
  const clinicName = script.patients?.clinics?.name;
  const doctorName = script.patients?.clinics?.doctor_name;

  return (
    <>
      <TableRow className="hover:bg-gray-50/50 transition-colors duration-200">
        <TableCell>
          <PatientInfo patient={script.patients} />
        </TableCell>
        {!hideClinicColumn && (
          <TableCell>
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {clinicName || 'N/A'}
                </p>
                <p className="text-sm text-gray-600">
                  {doctorName ? `Dr. ${doctorName}` : 'N/A'}
                </p>
              </div>
            </div>
          </TableCell>
        )}
        <TableCell>
          <div className="space-y-1">
            <p className="font-medium text-gray-900">
              {script.appliance_type.split('-').map((word: string) => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </p>
            <p className="text-sm text-gray-600">
              {script.arch.charAt(0).toUpperCase() + script.arch.slice(1)} Arch
            </p>
          </div>
        </TableCell>
        <TableCell>
          <div className="text-sm text-gray-600">
            {script.due_date}
          </div>
        </TableCell>
        <TableCell>
          <Badge 
            variant="secondary"
            className={`flex items-center gap-1 w-fit ${getStatusColor(script.status)}`}
          >
            <span className="capitalize">{script.status.replace('_', ' ')}</span>
          </Badge>
        </TableCell>
        <TableCell>
          <Badge 
            variant="secondary"
            className={`flex items-center gap-1 w-fit ${getPaymentStatusColor(script.payment_status)}`}
          >
            <span className="capitalize">{script.payment_status}</span>
          </Badge>
        </TableCell>
        <TableCell>
          <div className="text-sm text-gray-600">
            {format(new Date(script.created_at), 'MMM d, yyyy')}
          </div>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-2">
            {onStatusUpdate && (
              <StatusUpdateButtons script={script} onStatusUpdate={onStatusUpdate} />
            )}
            <LabScriptActions script={script} onPreview={onPreview} />
          </div>
        </TableCell>
      </TableRow>

      {showPrintPreview && (
        <PreviewLabScriptModal
          isOpen={showPrintPreview}
          onClose={() => setShowPrintPreview(false)}
          labScriptId={script.id}
          printMode={true}
        />
      )}
    </>
  );
};