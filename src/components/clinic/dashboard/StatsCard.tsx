import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface StatsCardProps {
  label: string;
  value: string;
  change: string;
  trend: number[];
  positive: boolean;
  subtitle: string;
}

export const StatsCard = ({ label, value, change, trend, positive, subtitle }: StatsCardProps) => {
  return (
    <Card className="bg-white hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">{label}</h3>
              <p className="text-2xl font-semibold mt-1">{value}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-sm ${positive ? "text-green-500" : "text-red-500"}`}>
                  {change}
                </span>
                <span className="text-sm text-gray-500">{subtitle}</span>
              </div>
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
        </div>
      </CardContent>
    </Card>
  );
};