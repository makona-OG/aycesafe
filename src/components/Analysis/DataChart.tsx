import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parse, isValid } from 'date-fns';

interface DataChartProps {
  data: any[];
  columns: string[];
}

export const DataChart = ({ data, columns }: DataChartProps) => {
  // Detect timestamp column (usually first column)
  const timeColumns = columns.filter(col => 
    col.toLowerCase().includes('time') || 
    col.toLowerCase().includes('date') ||
    col.toLowerCase().includes('timestamp')
  );
  
  const timeColumn = timeColumns[0] || columns[0]; // Default to first column if no obvious time column
  const valueColumns = columns.filter(col => col !== timeColumn);

  // Process data and handle timestamps
  const chartData = data.slice(1).map((row, index) => {
    const dataPoint: any = {};
    
    // Handle timestamp
    const timeValue = row[columns.indexOf(timeColumn)];
    let parsedDate;
    
    // Try different date formats
    const dateFormats = [
      'yyyy-MM-dd HH:mm:ss',
      'yyyy-MM-dd',
      'MM/dd/yyyy HH:mm:ss',
      'MM/dd/yyyy'
    ];

    for (const format of dateFormats) {
      parsedDate = parse(timeValue, format, new Date());
      if (isValid(parsedDate)) break;
    }

    dataPoint.timestamp = isValid(parsedDate) ? parsedDate.getTime() : timeValue;

    // Handle numeric values
    valueColumns.forEach(col => {
      const value = parseFloat(row[columns.indexOf(col)]);
      if (!isNaN(value)) {
        dataPoint[col] = value;
      }
    });

    return dataPoint;
  }).sort((a, b) => a.timestamp - b.timestamp); // Sort by timestamp

  const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'];

  return (
    <div className="w-full h-[400px] mt-4">
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="timestamp" 
            type="number"
            domain={['auto', 'auto']}
            tickFormatter={(timestamp) => {
              if (typeof timestamp === 'number') {
                return format(new Date(timestamp), 'MMM dd, yyyy HH:mm');
              }
              return timestamp;
            }}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis />
          <Tooltip 
            labelFormatter={(timestamp) => {
              if (typeof timestamp === 'number') {
                return format(new Date(timestamp), 'MMM dd, yyyy HH:mm:ss');
              }
              return timestamp;
            }}
          />
          <Legend />
          {valueColumns.map((col, index) => (
            <Line
              key={col}
              type="monotone"
              dataKey={col}
              stroke={colors[index % colors.length]}
              dot={false}
              name={col}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};