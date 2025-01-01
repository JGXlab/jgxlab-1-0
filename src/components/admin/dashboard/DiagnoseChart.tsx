import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface DataPoint {
  name: string;
  value: number;
  color: string;
}

export const DiagnoseChart = ({ data }: { data: DataPoint[] }) => {
  return (
    <div className="h-[300px]">
      <h3 className="text-lg font-semibold mb-6">Diagnose Distribution</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};