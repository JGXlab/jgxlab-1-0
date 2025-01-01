import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CreatePatientForm } from "@/components/patients/CreatePatientForm";
import { FormControl } from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface PatientSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function PatientSelector({ value, onChange }: PatientSelectorProps) {
  const [open, setOpen] = useState(false);
  const [createPatientOpen, setCreatePatientOpen] = useState(false);

  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: async () => {
      console.log('Fetching patients...');
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || []; // Ensure we always return an array
    }
  });

  if (isLoading) {
    return (
      <Button variant="outline" className="w-full justify-between" disabled>
        Loading patients...
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    );
  }

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between w-full"
            >
              {value
                ? patients?.find((patient) => patient.id === value)
                  ? `${patients.find((patient) => patient.id === value)?.first_name} ${
                      patients?.find((patient) => patient.id === value)?.last_name
                    }`
                : "Select patient"
                : "Select patient"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput placeholder="Search patients..." />
            <CommandEmpty>
              No patient found.
              <Button
                type="button"
                variant="link"
                className="mt-2"
                onClick={() => {
                  setOpen(false);
                  setCreatePatientOpen(true);
                }}
              >
                Create new patient
              </Button>
            </CommandEmpty>
            <CommandGroup>
              {patients?.map((patient) => (
                <CommandItem
                  key={patient.id}
                  value={patient.id}
                  onSelect={() => {
                    onChange(patient.id);
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
          </Command>
        </PopoverContent>
      </Popover>
      <Dialog open={createPatientOpen} onOpenChange={setCreatePatientOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline">
            New Patient
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Patient</DialogTitle>
          </DialogHeader>
          <CreatePatientForm onSuccess={() => setCreatePatientOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}