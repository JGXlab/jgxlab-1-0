import { useNavigate, useLocation } from "react-router-dom";
import { Bell, Search, UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 w-64 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-sm"
        />
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="relative p-2 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] hover:bg-[#8B5CF6]/20 transition-all duration-200">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center border-2 border-white">
            2
          </span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 ring-2 ring-[#8B5CF6]/20 ring-offset-2 ring-offset-white transition-all duration-200 hover:ring-[#8B5CF6]/40 cursor-pointer">
              <AvatarFallback className="bg-[#8B5CF6]/10 text-[#8B5CF6]">D</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate('/design/myprofile')}>
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/design/settings')}>
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}