import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface StatsCardProps {
  label: string;
  value: string;
  change: string;
  trend: number[];
  positive: boolean;
}

export const StatsCard = ({ label, value, change, trend, positive }: StatsCardProps) => {
  return (
    <Card className="bg-white hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            <p className={`text-sm mt-1 ${positive ? "text-green-500" : "text-red-500"}`}>
              {change}
            </p>
          </div>
          <div className="w-24 h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend.map((value, i) => ({ value }))}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={positive ? "#4F46E5" : "#EF4444"}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};