import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, FileText, Clock, CheckCircle } from "lucide-react";

export const ClinicDashboard = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Clinic Dashboard
        </h1>
        <Button className="bg-accent hover:bg-accent/90 transition-all duration-300 transform hover:scale-105">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Design Order
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="transform hover:scale-105 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Orders
            </CardTitle>
            <Clock className="h-4 w-4 text-primary animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">3</div>
          </CardContent>
        </Card>
        <Card className="transform hover:scale-105 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">12</div>
          </CardContent>
        </Card>
        <Card className="transform hover:scale-105 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <FileText className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">15</div>
          </CardContent>
        </Card>
      </div>

      <Card className="animate-fade-in bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-primary">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground text-center py-8">
            No recent orders to display
          </div>
        </CardContent>
      </Card>
    </div>
  );
};