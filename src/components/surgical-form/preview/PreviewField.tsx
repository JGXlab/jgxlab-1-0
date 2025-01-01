interface PreviewFieldProps {
  label: string;
  value: string;
}

export const PreviewField = ({ label, value }: PreviewFieldProps) => (
  <div className="space-y-1.5">
    <p className="text-sm font-medium text-muted-foreground">{label}</p>
    <p className="text-sm text-foreground">{value}</p>
  </div>
);