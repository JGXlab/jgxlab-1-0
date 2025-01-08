import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Receipt, MoreVertical, AlertCircle, ExternalLink, Download } from "lucide-react";
import { format } from "date-fns";
import { getStatusColor, getPaymentStatusColor } from "./utils/statusStyles";
import { StatusUpdateButtons } from "./StatusUpdateButtons";
import { useState, useCallback } from "react";
import { InvoicePreviewDialog } from "./payment/InvoicePreviewDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PatientCell } from "./table/PatientCell";
import { ClinicCell } from "./table/ClinicCell";
import { ApplianceCell } from "./table/ApplianceCell";

interface TableRowContentProps {
  script: any;
  onPreview: (script: any, e: React.MouseEvent) => void;
  onStatusUpdate?: (id: string, status: string, reason?: string, comment?: string, designUrl?: string) => void;
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
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);

  const handleViewInvoice = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowInvoiceDialog(true);
  }, []);

  const handleCloseInvoice = useCallback(() => {
    setShowInvoiceDialog(false);
  }, []);

  // Format the hold reason to be more readable
  const formatHoldReason = (reason: string) => {
    return reason.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <>
      <TableRow className="hover:bg-gray-50/50 transition-colors duration-200">
        <PatientCell 
          firstName={script.patients?.first_name}
          lastName={script.patients?.last_name}
          patientId={script.patient_id}
          expressDesign={script.express_design}
        />

        {!hideClinicColumn && (
          <ClinicCell 
            clinicName={script.patients?.clinics?.name}
            doctorName={script.patients?.clinics?.doctor_name}
          />
        )}

        <ApplianceCell 
          applianceType={script.appliance_type}
          arch={script.arch}
        />

        <TableCell>
          <div className="text-sm text-gray-600">
            {script.due_date}
          </div>
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary"
              className={`flex items-center gap-1 w-fit ${getStatusColor(script.status)}`}
            >
              <span className="capitalize">{script.status.replace('_', ' ')}</span>
            </Badge>
            {script.status === 'on_hold' && script.hold_reason && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 bg-white p-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-gray-900">Hold Details</h4>
                    <div className="text-sm">
                      <p className="text-gray-700">
                        <span className="font-medium">Reason:</span> {formatHoldReason(script.hold_reason)}
                      </p>
                      {script.hold_comment && (
                        <p className="text-gray-700 mt-1">
                          <span className="font-medium">Comment:</span> {script.hold_comment}
                        </p>
                      )}
                      {script.design_url && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a 
                                href={script.design_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 inline-flex items-center gap-1"
                              >
                                <ExternalLink className="h-4 w-4" />
                                View Design
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Open design in new tab</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}
          </div>
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
              <StatusUpdateButtons 
                script={script} 
                onStatusUpdate={onStatusUpdate} 
              />
            )}
            {script.status === 'completed' && script.design_download_url && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={script.design_download_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download Design</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-48 bg-white border border-gray-200 shadow-lg rounded-md"
              >
                {script.payment_status === 'paid' && (
                  <>
                    <DropdownMenuItem 
                      onClick={handleViewInvoice}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <Receipt className="mr-2 h-4 w-4" />
                      View Invoice
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem 
                  onClick={(e) => onPreview(script, e)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Script
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>

      <InvoicePreviewDialog
        isOpen={showInvoiceDialog}
        onClose={handleCloseInvoice}
        labScript={script}
      />
    </>
  );
};