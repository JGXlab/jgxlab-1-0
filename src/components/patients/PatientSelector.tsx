import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreatePatientForm } from "./CreatePatientForm";
import { useToast } from "@/hooks/use-toast";

interface PatientSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  clinicId?: string;
}

export function PatientSelector({ value, onChange, className, clinicId }: PatientSelectorProps) {
  const [open, setOpen] = useState(false);
  const [createPatientOpen, setCreatePatientOpen] = useState(false);
  const { toast } = useToast();

  const { data: patients = [], isLoading, error } = useQuery({
    queryKey: ['patients', clinicId],
    queryFn: async () => {
      try {
        // First check if we have a valid session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (!session) {
          console.log("No active session found");
          throw new Error("No active session");
        }

        // If we have a valid session, proceed with the query
        const { data, error: patientsError } = await supabase
          .from('patients')
          .select('*')
          .eq('clinic_id', clinicId)
          .order('created_at', { ascending: false });

        if (patientsError) {
          console.error("Error fetching patients:", patientsError);
          throw patientsError;
        }

        return data || [];
      } catch (error) {
        console.error("Error in patient query:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load patients. Please try refreshing the page.",
        });
        return [];
      }
    },
    enabled: !!clinicId,
  });

  if (error) {
    console.error("Patient selector error:", error);
  }

  const selectedPatient = patients.find((patient) => patient.id === value);

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", className)}
            disabled={isLoading}
          >
            {value && selectedPatient
              ? `${selectedPatient.first_name} ${selectedPatient.last_name}`
              : "Select patient..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search patients..." />
            <div className="max-h-[300px] overflow-y-auto">
              <CommandEmpty>
                No patient found.
                <Button
                  variant="ghost"
                  className="w-full mt-2"
                  onClick={() => {
                    setCreatePatientOpen(true);
                    setOpen(false);
                  }}
                >
                  Create new patient
                </Button>
              </CommandEmpty>
              <CommandGroup>
                {patients.map((patient) => (
                  <CommandItem
                    key={patient.id}
                    value={`${patient.first_name} ${patient.last_name}`}
                    onSelect={() => {
                      onChange?.(patient.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === patient.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {patient.first_name} {patient.last_name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
      <Button 
        variant="outline"
        onClick={() => setCreatePatientOpen(true)}
      >
        New Patient
      </Button>
      <Dialog open={createPatientOpen} onOpenChange={setCreatePatientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Patient</DialogTitle>
          </DialogHeader>
          <CreatePatientForm 
            onSuccess={() => {
              setCreatePatientOpen(false);
            }} 
            clinicId={clinicId}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}