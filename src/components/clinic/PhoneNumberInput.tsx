import React from "react";
import { Control } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Clinic } from "@/components/clinics/types";

interface PhoneNumberInputProps {
  control: Control<Clinic>;
  name: "phone" | "contact_phone";
  label: string;
}

export function PhoneNumberInput({ control, name, label }: PhoneNumberInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <PhoneInput
              country="us"
              value={value}
              onChange={onChange}
              inputClass="!w-full !h-10 !text-base !rounded-md !border !border-input"
              containerClass="!w-full"
              buttonClass="!border !border-input !rounded-l-md"
              dropdownClass="!bg-white"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}