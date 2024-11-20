import { HistoricalData } from "@/lib/types";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: HistoricalData[];
}

export const HistoricalChart = ({ data }: Props) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Water Level History</h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value) => new Date(value).toLocaleTimeString()} 
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleString()}
              formatter={(value: number) => [`${value}m`, 'Water Level']}
            />
            <Line 
              type="monotone" 
              dataKey="level" 
              stroke="#1E40AF" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};