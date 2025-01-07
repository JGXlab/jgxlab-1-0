import { Card } from "@/components/ui/card";
import { Clock, RefreshCw, Pause, StopCircle, AlertTriangle, CheckCircle2, Files } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface DashboardStatusCardsProps {
  stats: {
    pending: number;
    inProgress: number;
    paused: number;
    onHold: number;
    incomplete: number;
    completed: number;
    all: number;
  };
}

export const DashboardStatusCards = ({ stats }: DashboardStatusCardsProps) => {
  const cards = [
    {
      title: "New Lab Scripts",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      progressColor: "bg-amber-400",
    },
    {
      title: "In Process",
      value: stats.inProgress,
      icon: RefreshCw,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      progressColor: "bg-blue-400",
    },
    {
      title: "Paused",
      value: stats.paused,
      icon: Pause,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      progressColor: "bg-orange-400",
    },
    {
      title: "On Hold",
      value: stats.onHold,
      icon: StopCircle,
      color: "text-red-500",
      bgColor: "bg-red-50",
      progressColor: "bg-red-400",
    },
    {
      title: "Incomplete",
      value: stats.incomplete,
      icon: AlertTriangle,
      color: "text-pink-500",
      bgColor: "bg-pink-50",
      progressColor: "bg-pink-400",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      progressColor: "bg-emerald-400",
    },
    {
      title: "All Scripts",
      value: stats.all,
      icon: Files,
      color: "text-violet-500",
      bgColor: "bg-violet-50",
      progressColor: "bg-violet-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const progressValue = stats.all > 0 ? (card.value / stats.all) * 100 : 0;
        
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="w-full"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="bg-white hover:shadow-md transition-all duration-200">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${card.bgColor}`}>
                        <Icon className={`h-5 w-5 ${card.color}`} />
                      </div>
                      <span className="text-3xl font-bold">{card.value}</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">{card.title}</h3>
                    <Progress 
                      value={progressValue} 
                      className="h-2 bg-gray-100"
                      indicatorClassName={card.progressColor}
                    />
                  </div>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>{card.title}: {card.value}</p>
              </TooltipContent>
            </Tooltip>
          </motion.div>
        );
      })}
    </div>
  );
};