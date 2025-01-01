import { ReactNode } from 'react';

interface PreviewFieldProps {
  label: string;
  value: ReactNode;
}

export const PreviewField = ({ label, value }: PreviewFieldProps) => (
  <div className="space-y-1">
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <div className="text-sm font-semibold text-gray-900">{value}</div>
  </div>
);