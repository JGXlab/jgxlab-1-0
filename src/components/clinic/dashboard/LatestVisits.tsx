import { Card, CardContent } from "@/components/ui/card";

interface Visit {
  name: string;
  specialty: string;
  time: string;
  avatar: string;
}

interface LatestVisitsProps {
  appointments: Visit[];
}

export const LatestVisits = ({ appointments }: LatestVisitsProps) => {
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-6">Latest Visits</h3>
        <div className="space-y-4">
          {appointments.map((appointment, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <img
                  src={appointment.avatar}
                  alt={appointment.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium">{appointment.name}</p>
                  <p className="text-sm text-gray-500">{appointment.specialty}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500">{appointment.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};