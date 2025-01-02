interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  description?: string;
}

export const FormSection = ({ title, children, className, description }: FormSectionProps) => {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      {children}
    </div>
  );
};