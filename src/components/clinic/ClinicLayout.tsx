import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export function ClinicLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b z-50">
        <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-[#0052FF]">JGX Digital Lab</h1>
            
            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-[#0052FF] hover:bg-blue-50"
                onClick={() => navigate('/clinic/dashboard')}
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-[#0052FF] hover:bg-blue-50"
                onClick={() => navigate('/clinic/patients')}
              >
                Patients
              </Button>
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-[#0052FF] hover:bg-blue-50"
                onClick={() => navigate('/clinic/submittedlabscripts')}
              >
                Lab Scripts
              </Button>
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-[#0052FF] hover:bg-blue-50"
                onClick={() => navigate('/clinic/pricing')}
              >
                Pricing
              </Button>
            </nav>
          </div>

          {/* Right Section: Search, Notifications, Profile */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-gray-50 border-gray-200 focus:border-[#0052FF] focus:ring-1 focus:ring-[#0052FF]"
              />
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-600 hover:text-[#0052FF] hover:bg-blue-50"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>

            <Button
              variant="ghost"
              className="flex items-center space-x-2 hover:bg-blue-50"
              onClick={() => navigate('/clinic/myaccount')}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16 min-h-screen">
        <div className="max-w-[1400px] mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}