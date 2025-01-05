import { DesignLayout } from "@/components/design/DesignLayout";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DesignNavbar } from "@/components/design/DesignNavbar";
import { useState } from "react";

export default function DesignMyProfile() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: designerProfile, isLoading } = useQuery({
    queryKey: ['designerProfile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
      
      const { data: designer } = await supabase
        .from('designers')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();
      
      return designer;
    }
  });

  if (isLoading) {
    return (
      <DesignLayout>
        <div className="flex flex-col max-w-[1400px] w-full mx-auto h-screen py-8">
          <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
            <DesignNavbar 
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-8 w-32 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </DesignLayout>
    );
  }

  return (
    <DesignLayout>
      <div className="flex flex-col max-w-[1400px] w-full mx-auto h-screen py-8">
        <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
          <DesignNavbar 
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
          <div className="p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-bold mb-6">Profile</h1>
            
            <Card className="shadow-md bg-gradient-to-br from-white to-accent/30 border-none">
              <CardHeader className="border-b pb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#8B5CF6]/10 rounded-full">
                    <User className="w-6 h-6 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Personal Information</h2>
                    <p className="text-sm text-muted-foreground">Your basic profile details</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{`${designerProfile?.first_name} ${designerProfile?.last_name}`}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{designerProfile?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{designerProfile?.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">Not specified</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </DesignLayout>
  );
}
