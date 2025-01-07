import { Card } from "@/components/ui/card";
import { Clock, RefreshCw, Pause, StopCircle, AlertTriangle, CheckCircle2, Files } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: filteredLabScripts = [] } = useQuery({
    queryKey: ['labScripts', selectedStatus],
    queryFn: async () => {
      if (!selectedStatus) return [];
      
      console.log('Fetching lab scripts for status:', selectedStatus);
      const { data, error } = await supabase
        .from('lab_scripts')
        .select(`
          *,
          patients (
            first_name,
            last_name
          )
        `)
        .eq('status', selectedStatus)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching lab scripts:', error);
        throw error;
      }

      console.log('Fetched filtered lab scripts:', data);
      return data || [];
    },
    enabled: !!selectedStatus,
  });

  const cards = [
    {
      title: "New Lab Scripts",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      progressColor: "bg-amber-400",
      status: "pending"
    },
    {
      title: "In Process",
      value: stats.inProgress,
      icon: RefreshCw,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      progressColor: "bg-blue-400",
      status: "in_progress"
    },
    {
      title: "Paused",
      value: stats.paused,
      icon: Pause,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      progressColor: "bg-orange-400",
      status: "paused"
    },
    {
      title: "On Hold",
      value: stats.onHold,
      icon: StopCircle,
      color: "text-red-500",
      bgColor: "bg-red-50",
      progressColor: "bg-red-400",
      status: "on_hold"
    },
    {
      title: "Incomplete",
      value: stats.incomplete,
      icon: AlertTriangle,
      color: "text-pink-500",
      bgColor: "bg-pink-50",
      progressColor: "bg-pink-400",
      status: "incomplete"
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      progressColor: "bg-emerald-400",
      status: "completed"
    },
    {
      title: "All Scripts",
      value: stats.all,
      icon: Files,
      color: "text-violet-500",
      bgColor: "bg-violet-50",
      progressColor: "bg-violet-400",
      status: null
    },
  ];

  const handleCardClick = (status: string | null) => {
    setSelectedStatus(status);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-orange-100 text-orange-800';
      case 'on_hold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
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
              onClick={() => handleCardClick(card.status)}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className="bg-white hover:shadow-md transition-all duration-200 cursor-pointer">
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedStatus ? cards.find(card => card.status === selectedStatus)?.title : 'All Lab Scripts'}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] mt-4">
            {filteredLabScripts.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No lab scripts found.</p>
            ) : (
              <div className="space-y-4">
                {filteredLabScripts.map((script: any) => (
                  <div
                    key={script.id}
                    className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">
                          {script.patients?.first_name} {script.patients?.last_name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Created on {format(new Date(script.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <Badge className={getStatusColor(script.status)}>
                        {script.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-gray-500">Appliance Type</p>
                        <p>{script.appliance_type}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Treatment Type</p>
                        <p>{script.treatment_type}</p>
                      </div>
                      {script.specific_instructions && (
                        <div className="col-span-2">
                          <p className="text-gray-500">Instructions</p>
                          <p>{script.specific_instructions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};