import { Card } from "@/components/ui/card";
import { Clock, FileCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardsProps {
  stats: {
    pending: number;
    inProgress: number;
    urgent: number;
    completed: number;
  };
}

export const StatsCards = ({ stats }: StatsCardsProps) => {
  const cards = [
    {
      title: "New Lab Scripts",
      value: stats.pending,
      icon: Clock,
      color: "text-[#8B5CF6]",
      bgColor: "bg-[#8B5CF6]/10",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: FileCheck,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Urgent",
      value: stats.urgent,
      icon: AlertCircle,
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-white hover:shadow-md transition-all duration-200">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">{card.title}</span>
                  <div className={`p-2 rounded-lg ${card.bgColor}`}>
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold mt-2">{card.value}</p>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};