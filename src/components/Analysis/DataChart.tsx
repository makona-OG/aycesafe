import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataChartProps {
  data: any[];
  columns: string[];
}

export const DataChart = ({ data, columns }: DataChartProps) => {
  // Skip the first row if it contains headers
  const chartData = data.slice(1).map((row, index) => {
    const dataPoint: any = { name: `Point ${index + 1}` };
    columns.forEach((col, colIndex) => {
      const value = parseFloat(row[colIndex]);
      if (!isNaN(value)) {
        dataPoint[col] = value;
      }
    });
    return dataPoint;
  });

  const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'];

  return (
    <div className="w-full h-[400px] mt-4">
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {columns.map((col, index) => (
            <Line
              key={col}
              type="monotone"
              dataKey={col}
              stroke={colors[index % colors.length]}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};