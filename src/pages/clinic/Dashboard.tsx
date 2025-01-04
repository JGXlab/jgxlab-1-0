import { ClinicLayout } from "@/components/clinic/ClinicLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight } from "lucide-react";
import { ClinicNavHeader } from "@/components/clinic/ClinicNavHeader";

const data = [
  { name: 'Jan', value: 2 },
  { name: 'Feb', value: 4 },
  { name: 'Mar', value: 3 },
  { name: 'Apr', value: 5 },
  { name: 'May', value: 7 },
  { name: 'Jun', value: 8 },
  { name: 'Jul', value: 6 },
  { name: 'Aug', value: 4 },
  { name: 'Sep', value: 5 },
  { name: 'Oct', value: 6 },
  { name: 'Nov', value: 7 },
  { name: 'Dec', value: 6 },
];

const employeeData = [
  { id: '1020', name: 'Norma Troy', role: 'UI/UX Designer', performance: 75, notes: 'Very Much Appreciate' },
  { id: '1021', name: 'Thomas Poston', role: 'Web Designer', performance: 65, notes: 'No Complaints Here' },
  { id: '1022', name: 'Kimberly Andersen', role: 'React Native Developer', performance: 50, notes: 'Found Critical Error' },
];

const clientData = [
  { name: 'William Olguin', project: 'Security Camera App', status: 'Completed' },
  { name: 'Douglas Gonzales', project: 'Onlyfans Website', status: 'Planed' },
  { name: 'Marcus Roddy', project: 'Storage Unit Rent Website', status: 'Active' },
];

export default function ClinicDashboard() {
  return (
    <ClinicLayout>
      <div className="flex flex-col max-w-[1200px] w-full mx-auto h-screen py-8">
        <ScrollArea className="h-full rounded-2xl bg-[#F6F6F7]">
          <ClinicNavHeader />
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 w-full">
              {/* Client Overview Chart */}
              <Card className="w-full overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">Client Overview</CardTitle>
                  <select className="border rounded-md px-2 py-1 text-sm sm:text-base">
                    <option>Monthly</option>
                    <option>Weekly</option>
                    <option>Daily</option>
                  </select>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="h-[250px] sm:h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#375bdc" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <div className="space-y-4 sm:space-y-6 lg:space-y-8 w-full">
                <Card className="bg-primary text-white w-full">
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex justify-between items-center w-full">
                      <CardTitle className="text-white flex items-center gap-2 text-lg sm:text-xl">
                        Total Employees
                        <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
                      </CardTitle>
                      <span className="text-3xl sm:text-4xl font-bold">550</span>
                    </div>
                  </CardHeader>
                </Card>

                <Card className="bg-primary text-white w-full">
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex justify-between items-center w-full">
                      <CardTitle className="text-white flex items-center gap-2 text-lg sm:text-xl">
                        Client's Feedback
                        <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
                      </CardTitle>
                      <span className="text-3xl sm:text-4xl font-bold">120</span>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* Employee List */}
            <Card className="w-full mt-4 sm:mt-6 lg:mt-8">
              <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Employee List</CardTitle>
                <button className="text-primary hover:underline text-sm sm:text-base">View All</button>
              </CardHeader>
              <CardContent className="w-full overflow-x-auto p-4 sm:p-6">
                <div className="w-full min-w-[800px]">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-muted-foreground">
                        <th className="p-3 sm:p-4">Id</th>
                        <th className="p-3 sm:p-4">Employee</th>
                        <th className="p-3 sm:p-4">Designation</th>
                        <th className="p-3 sm:p-4">Work Performance</th>
                        <th className="p-3 sm:p-4">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeData.map((employee) => (
                        <tr key={employee.id} className="border-t">
                          <td className="p-3 sm:p-4">{employee.id}</td>
                          <td className="p-3 sm:p-4 flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{employee.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm sm:text-base">{employee.name}</span>
                          </td>
                          <td className="p-3 sm:p-4 text-sm sm:text-base">{employee.role}</td>
                          <td className="p-3 sm:p-4 w-[200px]">
                            <Progress value={employee.performance} className="h-2" />
                            <span className="text-xs sm:text-sm text-muted-foreground ml-2">
                              {employee.performance}%
                            </span>
                          </td>
                          <td className="p-3 sm:p-4 text-sm sm:text-base">{employee.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Client List */}
            <Card className="w-full mt-4 sm:mt-6 lg:mt-8">
              <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Client List</CardTitle>
                <button className="text-primary hover:underline text-sm sm:text-base">View All</button>
              </CardHeader>
              <CardContent className="w-full overflow-x-auto p-4 sm:p-6">
                <div className="w-full min-w-[800px]">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-muted-foreground">
                        <th className="p-3 sm:p-4">Client</th>
                        <th className="p-3 sm:p-4">Project</th>
                        <th className="p-3 sm:p-4">Project Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientData.map((client, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-3 sm:p-4 flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{client.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm sm:text-base">{client.name}</span>
                          </td>
                          <td className="p-3 sm:p-4 text-sm sm:text-base">{client.project}</td>
                          <td className="p-3 sm:p-4">
                            <span className={`px-3 py-1 rounded-full text-xs sm:text-sm ${
                              client.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              client.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {client.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </ClinicLayout>
  );
}
