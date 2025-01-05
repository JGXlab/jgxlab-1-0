import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface StatusDistributionChartProps {
  data: Array<{
    name: string;
    value: number;
    percentage: string;
  }>;
  colors: string[];
  totalScripts: number;
}

export const StatusDistributionChart = ({ data, colors, totalScripts }: StatusDistributionChartProps) => {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => 
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]}
                className="transition-all duration-300 hover:opacity-80"
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number, name: string) => [
              `${value} (${((value / totalScripts) * 100).toFixed(0)}%)`,
              name
            ]}
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem',
              padding: '0.5rem'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};