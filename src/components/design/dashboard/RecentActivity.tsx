import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface RecentActivityProps {
  labScripts: any[];
}

export const RecentActivity = ({ labScripts }: RecentActivityProps) => {
  const recentScripts = labScripts.slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-[#8B5CF6] bg-[#8B5CF6]/10';
      case 'in_progress':
        return 'text-yellow-500 bg-yellow-50';
      case 'completed':
        return 'text-emerald-500 bg-emerald-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return Clock;
      case 'completed':
        return CheckCircle2;
      default:
        return FileText;
    }
  };

  return (
    <Card className="bg-white">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {recentScripts.length > 0 ? (
              recentScripts.map((script, index) => {
                const StatusIcon = getStatusIcon(script.status);
                return (
                  <motion.div
                    key={script.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className={`p-2 rounded-lg ${getStatusColor(script.status)}`}>
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">
                          {script.patients?.first_name} {script.patients?.last_name}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {format(new Date(script.created_at), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {script.appliance_type.split('-').map((word: string) => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </p>
                      <div className="flex items-center mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(script.status)}`}>
                          {script.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center text-gray-500 py-8">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};