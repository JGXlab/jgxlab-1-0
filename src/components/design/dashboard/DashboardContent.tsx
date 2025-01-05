import { motion } from "framer-motion";
import { StatsCards } from "./StatsCards";
import { RecentActivity } from "./RecentActivity";
import { LabScriptsTable } from "@/components/lab-scripts/LabScriptsTable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

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

export const DashboardContent = ({ labScripts, isLoading, stats, onPreview }: DashboardContentProps) => {
  return (
    <motion.div 
      className="p-4 sm:p-6 lg:p-8 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <StatsCards stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Recent Lab Scripts */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-white h-[600px] overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Lab Scripts</h3>
              <ScrollArea className="h-[500px] pr-4">
                <LabScriptsTable 
                  labScripts={labScripts.slice(0, 5)}
                  isLoading={isLoading}
                  onPreview={onPreview}
                  isDesignPortal={true}
                  hideClinicColumn={false}
                />
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