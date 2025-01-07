import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Ticket } from "lucide-react";

interface CouponBadgeProps {
  couponCode: string | null;
  applianceType: string;
}

export const CouponBadge = ({ couponCode, applianceType }: CouponBadgeProps) => {
  if (applianceType !== 'surgical-day' || !couponCode) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="secondary" 
            className="ml-2 bg-amber-100 text-amber-700 hover:bg-amber-100"
          >
            <Ticket className="h-3 w-3 mr-1" />
            Free Try-in: {couponCode}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>Use this code for one free printed try-in</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};