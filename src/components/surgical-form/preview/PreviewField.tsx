import { ReactNode } from 'react';
import { cn } from "@/lib/utils";

interface PreviewFieldProps {
  label: string;
  value: ReactNode;
  className?: string;
}

export const PreviewField = ({ label, value, className }: PreviewFieldProps) => (
  <div className="space-y-1">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <div className={cn("text-sm font-semibold text-gray-900", className)}>{value}</div>
  </div>
);