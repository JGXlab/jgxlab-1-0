import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, Receipt } from "lucide-react";
import { useState, useCallback } from "react";
import { PreviewLabScriptModal } from "@/components/surgical-form/PreviewLabScriptModal";
import { Invoice } from "@/components/lab-scripts/payment/Invoice";

interface LabScriptHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
}

export function LabScriptHistoryModal({ isOpen, onClose, patientId, patientName }: LabScriptHistoryModalProps) {
  const [selectedLabScript, setSelectedLabScript] = useState<string | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedInvoiceScript, setSelectedInvoiceScript] = useState<any>(null);

  const { data: labScripts, isLoading } = useQuery({
    queryKey: ['patientLabScripts', patientId],
    queryFn: async () => {
      console.log('Fetching lab scripts for patient:', patientId);
      const { data, error } = await supabase
        .from('lab_scripts')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching lab scripts:', error);
        throw error;
      }

      console.log('Fetched lab scripts:', data);
      return data;
    },
    enabled: !!patientId && isOpen,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-orange-100 text-orange-800';
      case 'on_hold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleClose = useCallback(() => {
    setShowInvoice(false);
    setSelectedInvoiceScript(null);
    setSelectedLabScript(null);
    onClose();
  }, [onClose]);

  const handleViewInvoice = useCallback((labScript: any) => {
    setSelectedInvoiceScript(labScript);
    setShowInvoice(true);
  }, []);

  const handleInvoiceClose = useCallback(() => {
    setShowInvoice(false);
    setSelectedInvoiceScript(null);
  }, []);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Lab Script History - {patientName}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] mt-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : !labScripts?.length ? (
              <p className="text-center py-8 text-gray-500">No lab scripts found for this patient.</p>
            ) : (
              <div className="space-y-4">
                {labScripts.map((script) => (
                  <div
                    key={script.id}
                    className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{script.appliance_type}</h4>
                        <p className="text-sm text-gray-500">
                          Created on {format(new Date(script.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Badge className={getStatusColor(script.status)}>
                        {script.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-gray-500">Arch</p>
                        <p>{script.arch}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Treatment Type</p>
                        <p>{script.treatment_type}</p>
                      </div>
                      {script.specific_instructions && (
                        <div className="col-span-2">
                          <p className="text-gray-500">Instructions</p>
                          <p>{script.specific_instructions}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedLabScript(script.id)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      {script.payment_status === 'paid' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewInvoice(script)}
                        >
                          <Receipt className="h-4 w-4 mr-2" />
                          View Invoice
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {selectedLabScript && (
        <PreviewLabScriptModal
          isOpen={!!selectedLabScript}
          onClose={() => setSelectedLabScript(null)}
          labScriptId={selectedLabScript}
        />
      )}

      {showInvoice && selectedInvoiceScript && (
        <Dialog open={showInvoice} onOpenChange={handleInvoiceClose}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Invoice</DialogTitle>
            </DialogHeader>
            <Invoice 
              labScript={selectedInvoiceScript} 
              onClose={handleInvoiceClose}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}