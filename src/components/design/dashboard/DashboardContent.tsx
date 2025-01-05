import { motion } from "framer-motion";
import { StatsCards } from "./StatsCards";
import { RecentActivity } from "./RecentActivity";
import { LabScriptsTable } from "@/components/lab-scripts/LabScriptsTable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { format, isToday, isPast } from "date-fns";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DashboardContentProps {
  labScripts: any[];
  isLoading: boolean;
  stats: {
    pending: number;
    inProgress: number;
    urgent: number;
    completed: number;
  };
  onPreview: (script: any, e: React.MouseEvent) => void;
}

type ViewType = 'recent' | 'dueToday' | 'overdue' | 'stats';

export const DashboardContent = ({ labScripts, isLoading, stats, onPreview }: DashboardContentProps) => {
  const [currentView, setCurrentView] = useState<ViewType>('recent');

  const getFilteredScripts = () => {
    switch (currentView) {
      case 'dueToday':
        return labScripts.filter(script => isToday(new Date(script.due_date)));
      case 'overdue':
        return labScripts.filter(script => 
          isPast(new Date(script.due_date)) && !isToday(new Date(script.due_date)) && script.status !== 'completed'
        );
      case 'recent':
      default:
        return labScripts.slice(0, 5);
    }
  };

  const getStatusStats = () => {
    const statusCounts = labScripts.reduce((acc, script) => {
      acc[script.status] = (acc[script.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      percentage: (count / labScripts.length * 100).toFixed(0) + '%'
    }));
  };

  const COLORS = ['#375bdc', '#f59e0b', '#ef4444', '#22c55e', '#64748b'];

  const renderContent = () => {
    if (currentView === 'stats') {
      const data = getStatusStats();
      return (
        <div className="h-full flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold mb-6">Lab Script Status Distribution</h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string) => [`${value} (${(value / labScripts.length * 100).toFixed(0)}%)`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-2 w-full max-w-sm">
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium">{item.name}</span>
                </div>
                <span className="text-sm text-gray-600">{item.percentage}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <LabScriptsTable 
        labScripts={getFilteredScripts()}
        isLoading={isLoading}
        onPreview={onPreview}
        isDesignPortal={true}
        hideClinicColumn={false}
      />
    );
  };

  return (
    <motion.div 
      className="p-4 sm:p-6 lg:p-8 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <StatsCards stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Lab Scripts Views */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-white h-[500px] overflow-hidden">
            <div className="p-6">
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                <Button 
                  variant={currentView === 'recent' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('recent')}
                  size="sm"
                >
                  Recent
                </Button>
                <Button 
                  variant={currentView === 'dueToday' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('dueToday')}
                  size="sm"
                >
                  Due Today
                </Button>
                <Button 
                  variant={currentView === 'overdue' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('overdue')}
                  size="sm"
                >
                  Overdue
                </Button>
                <Button 
                  variant={currentView === 'stats' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('stats')}
                  size="sm"
                >
                  Status Stats
                </Button>
              </div>
              <ScrollArea className="h-[400px] pr-4">
                {renderContent()}
              </ScrollArea>
            </div>
          </Card>
        </motion.div>

        {/* Right Column - Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <RecentActivity labScripts={labScripts} />
        </motion.div>
      </div>
    </motion.div>
  );
};