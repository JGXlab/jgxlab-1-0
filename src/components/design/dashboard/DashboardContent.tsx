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
import { ChartPie, Clock, AlertOctagon, Calendar } from "lucide-react";

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
                  variant={currentView === 'stats' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('stats')}
                  size="sm"
                  className={`transition-all duration-200 ${
                    currentView === 'stats' 
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm' 
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <ChartPie className="w-4 h-4" />
                  Status Stats
                </Button>
                <Button 
                  variant={currentView === 'recent' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('recent')}
                  size="sm"
                  className={`transition-all duration-200 ${
                    currentView === 'recent' 
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm' 
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Recent
                </Button>
                <Button 
                  variant={currentView === 'overdue' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('overdue')}
                  size="sm"
                  className={`transition-all duration-200 ${
                    currentView === 'overdue' 
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm' 
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <AlertOctagon className="w-4 h-4" />
                  Overdue
                </Button>
                <Button 
                  variant={currentView === 'dueToday' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('dueToday')}
                  size="sm"
                  className={`transition-all duration-200 ${
                    currentView === 'dueToday' 
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm' 
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Due Today
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