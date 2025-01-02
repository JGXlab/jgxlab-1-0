import { useNavigate } from "react-router-dom";

export const LabScriptsHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1"></div>
    </div>
  );
};