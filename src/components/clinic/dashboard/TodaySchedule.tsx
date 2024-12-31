import { Card, CardContent } from "@/components/ui/card";

export const TodaySchedule = () => {
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Today Schedule</h3>
          <p className="text-sm text-gray-500">September 11, 2024</p>
        </div>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />
          <div className="space-y-8">
            <div className="relative pl-8">
              <div className="absolute left-[13px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-600" />
              <div className="text-sm text-gray-500">8:00 AM</div>
            </div>
            <div className="relative pl-8">
              <div className="absolute left-[13px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-600" />
              <div className="text-sm text-gray-500">9:00 AM</div>
            </div>
            <div className="relative pl-8">
              <div className="absolute left-[13px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-600" />
              <div className="text-sm text-gray-500">10:00 AM</div>
            </div>
            <div className="relative pl-8">
              <div className="absolute left-[13px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-600" />
              <div className="text-sm text-gray-500">11:00 AM</div>
            </div>
            <div className="relative pl-8">
              <div className="absolute left-[13px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-600" />
              <div className="text-sm text-gray-500">12:00 PM</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};