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
      value: Number(count),
      percentage: ((Number(count) / labScripts.length) * 100).toFixed(0) + '%'
    }));
  };

  const COLORS = ['#9b87f5', '#D6BCFA', '#7E69AB', '#6E59A5', '#1A1F2C'];

  const renderContent = () => {
    if (currentView === 'stats') {
      const data = getStatusStats();
      return (
        <motion.div 
          className="h-full flex flex-col items-center justify-center p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-6">Lab Script Status Distribution</h3>
          <div className="w-full h-[250px]">
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
                  animationBegin={0}
                  animationDuration={800}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `${value} (${((value / labScripts.length) * 100).toFixed(0)}%)`,
                    name
                  ]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    padding: '0.5rem'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <motion.div 
            className="mt-4 grid grid-cols-2 gap-3 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {data.map((item, index) => (
              <motion.div 
                key={item.name}
                className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
                <span className="text-sm text-gray-600">{item.percentage}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
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
          <Card className="bg-white h-[500px]">
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
              <div className="h-[400px]">
                {renderContent()}
              </div>
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