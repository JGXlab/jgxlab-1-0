import { useNavigate } from "react-router-dom";

export const LabScriptsHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Lab Scripts</h1>
        <p className="text-sm text-gray-600">
          Manage and track your submitted lab scripts
        </p>
      </div>
    </div>
  );
};