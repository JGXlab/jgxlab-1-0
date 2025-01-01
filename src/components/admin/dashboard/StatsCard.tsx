import { LineChart, Line } from "recharts";

interface StatsCardProps {
  label: string;
  value: string;
  change: string;
  trend: number[];
  positive: boolean;
  subtitle: string;
}

export const StatsCard = ({ label, value, change, trend, positive, subtitle }: StatsCardProps) => {
  const data = trend.map((value) => ({ value }));

  return (
    <div className="bg-white rounded-xl p-6">
      <p className="text-gray-600 mb-1">{label}</p>
      <div className="flex items-end gap-2 mb-2">
        <p className="text-2xl font-semibold">{value}</p>
        <div className={`text-sm ${positive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
          {change}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{subtitle}</p>
        <div className="w-20 h-8">
          <LineChart width={80} height={32} data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={positive ? "#22C55E" : "#EF4444"}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </div>
      </div>
    </div>
  );
};