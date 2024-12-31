import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface OverviewChartProps {
  data: Array<{ name: string; value: number }>;
}

export const OverviewChart = ({ data }: OverviewChartProps) => {
  return (
    <Card className="lg:col-span-2 bg-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold">Overview</h3>
            <p className="text-sm text-gray-500">Avg per month</p>
            <p className="text-2xl font-bold mt-1">
              $138,500 <span className="text-sm text-green-500">+13.45%</span>
            </p>
          </div>
          <Tabs defaultValue="1y" className="w-auto">
            <TabsList>
              <TabsTrigger value="1y" className="text-sm">1 Year</TabsTrigger>
              <TabsTrigger value="6m" className="text-sm">6 Months</TabsTrigger>
              <TabsTrigger value="3m" className="text-sm">3 Months</TabsTrigger>
              <TabsTrigger value="1m" className="text-sm">1 Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};