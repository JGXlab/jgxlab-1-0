import { motion } from "framer-motion";
import { StatsCards } from "./StatsCards";
import { RecentActivity } from "./RecentActivity";
import { LabScriptsTable } from "@/components/lab-scripts/LabScriptsTable";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { format, isToday, isPast } from "date-fns";
import { StatusDistributionChart } from "./StatusDistributionChart";
import { StatusLegend } from "./StatusLegend";

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

  const COLORS = ['#8884d8', '#00C49F', '#FFBB28', '#FF8042'];

  const renderContent = () => {
    if (currentView === 'stats') {
      const data = getStatusStats();
      return (
        <div className="h-[400px] flex flex-col space-y-4">
          <StatusDistributionChart 
            data={data} 
            colors={COLORS} 
            totalScripts={labScripts.length} 
          />
          <StatusLegend data={data} colors={COLORS} />
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
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-white">
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
              {renderContent()}
            </div>
          </Card>
        </motion.div>

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