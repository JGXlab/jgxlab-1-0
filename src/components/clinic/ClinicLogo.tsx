import { Link } from "react-router-dom";

export const ClinicLogo = () => {
  return (
    <Link 
      to="/admin/dashboard" 
      className="flex items-center gap-2 p-4 transition-opacity hover:opacity-80"
    >
      <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
        <svg
          className="w-5 h-5 text-white"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 4L4 8L12 12L20 8L12 4Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 16L12 20L20 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 12L12 16L20 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold tracking-tight text-primary">JGX</span>
        <span className="text-sm font-medium text-gray-600">Xenityhealth</span>
      </div>
    </Link>
  );
};