import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClinicNavHeader } from "@/components/clinic/ClinicNavHeader";
import { Card } from "@/components/ui/card";
import { Settings2, User, Bell, Shield, CreditCard, Building2, Mail } from "lucide-react";
import { useState } from "react";
import { LabScriptsPageHeader } from "@/components/lab-scripts/LabScriptsPageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Settings() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const statusCounts = {
    new: 2,
    inProcess: 3,
    paused: 1,
    onHold: 0,
    incomplete: 4,
    completed: 5,
    all: 15,
  };

  const settingsItems = [
    {
      id: 1,
      icon: <User className="h-5 w-5 text-purple-500" />,
      name: "Profile Settings",
      description: "Update your personal information and preferences",
      status: "Active",
      lastUpdated: "2024-03-20"
    },
    {
      id: 2,
      icon: <Bell className="h-5 w-5 text-blue-500" />,
      name: "Notification Preferences",
      description: "Manage your notification settings",
      status: "Active",
      lastUpdated: "2024-03-19"
    },
    {
      id: 3,
      icon: <Shield className="h-5 w-5 text-green-500" />,
      name: "Security Settings",
      description: "Update your security preferences and password",
      status: "Active",
      lastUpdated: "2024-03-18"
    },
    {
      id: 4,
      icon: <CreditCard className="h-5 w-5 text-orange-500" />,
      name: "Billing Settings",
      description: "Manage your billing information and payment methods",
      status: "Active",
      lastUpdated: "2024-03-17"
    },
    {
      id: 5,
      icon: <Building2 className="h-5 w-5 text-red-500" />,
      name: "Clinic Information",
      description: "Update your clinic details and address",
      status: "Active",
      lastUpdated: "2024-03-16"
    },
    {
      id: 6,
      icon: <Mail className="h-5 w-5 text-indigo-500" />,
      name: "Email Preferences",
      description: "Manage your email settings and subscriptions",
      status: "Active",
      lastUpdated: "2024-03-15"
    }
  ];

  const filteredSettings = settingsItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ClinicLayout>
      <div className="flex flex-col max-w-[1400px] w-full mx-auto h-screen py-8">
        <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
          <ClinicNavHeader />
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <LabScriptsPageHeader
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onNewLabScript={() => console.log('Add new setting clicked')}
              statusCounts={statusCounts}
              selectedStatus={null}
              onStatusSelect={() => {}}
            />

            <Card className="bg-gradient-to-br from-white to-accent/30 border-none shadow-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-none">
                    <TableHead className="text-primary/80 font-semibold w-12"></TableHead>
                    <TableHead className="text-primary/80 font-semibold">Setting</TableHead>
                    <TableHead className="text-primary/80 font-semibold hidden md:table-cell">Description</TableHead>
                    <TableHead className="text-primary/80 font-semibold">Status</TableHead>
                    <TableHead className="text-primary/80 font-semibold hidden lg:table-cell">Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSettings.map((item) => (
                    <TableRow 
                      key={item.id}
                      className="cursor-pointer hover:bg-gray-50/50 transition-colors"
                      onClick={() => console.log(`Clicked setting: ${item.name}`)}
                    >
                      <TableCell className="w-12">{item.icon}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-gray-600">{item.description}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-gray-600">
                        {new Date(item.lastUpdated).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </ClinicLayout>
  );
}