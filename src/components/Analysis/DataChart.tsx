import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parse, isValid, startOfDay, startOfWeek, startOfMonth, startOfYear } from 'date-fns';
import { useState } from 'react';
import { Button } from "@/components/ui/button";

interface DataChartProps {
  data: any[];
  columns: string[];
}

export const DataChart = ({ data, columns }: DataChartProps) => {
  const [timeRange, setTimeRange] = useState<'all' | 'daily' | 'weekly' | 'monthly' | 'yearly'>('all');
  
  // Detect timestamp column (usually first column)
  const timeColumns = columns.filter(col => 
    col.toLowerCase().includes('time') || 
    col.toLowerCase().includes('date') ||
    col.toLowerCase().includes('timestamp')
  );
  
  const timeColumn = timeColumns[0] || columns[0];
  const valueColumns = columns.filter(col => col !== timeColumn);

  // Process data and handle timestamps
  const processData = () => {
    const rawData = data.slice(1).map((row, index) => {
      const dataPoint: any = {};
      
      // Handle timestamp
      const timeValue = row[columns.indexOf(timeColumn)];
      let parsedDate;
      
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
    }).sort((a, b) => a.timestamp - b.timestamp);

    // Apply time range filtering and aggregation
    if (timeRange === 'all') return rawData;

    const aggregateData = new Map();
    
    rawData.forEach(point => {
      let periodStart;
      const date = new Date(point.timestamp);
      
      switch (timeRange) {
        case 'daily':
          periodStart = startOfDay(date).getTime();
          break;
        case 'weekly':
          periodStart = startOfWeek(date).getTime();
          break;
        case 'monthly':
          periodStart = startOfMonth(date).getTime();
          break;
        case 'yearly':
          periodStart = startOfYear(date).getTime();
          break;
        default:
          periodStart = point.timestamp;
      }

      if (!aggregateData.has(periodStart)) {
        aggregateData.set(periodStart, { 
          timestamp: periodStart,
          counts: {},
          sums: {} 
        });
      }

      const period = aggregateData.get(periodStart);
      valueColumns.forEach(col => {
        if (point[col] !== undefined) {
          period.counts[col] = (period.counts[col] || 0) + 1;
          period.sums[col] = (period.sums[col] || 0) + point[col];
        }
      });
    });

    return Array.from(aggregateData.values()).map(period => {
      const result = { timestamp: period.timestamp };
      valueColumns.forEach(col => {
        if (period.counts[col]) {
          result[col] = period.sums[col] / period.counts[col];
        }
      });
      return result;
    }).sort((a, b) => a.timestamp - b.timestamp);
  };

  const chartData = processData();
  const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'];

  // Detect units from column names
  const getUnit = (columnName: string): string => {
    const lowerCol = columnName.toLowerCase();
    if (lowerCol.includes('temperature')) return '°C';
    if (lowerCol.includes('pressure')) return 'hPa';
    if (lowerCol.includes('humidity')) return '%';
    if (lowerCol.includes('level') || lowerCol.includes('height')) return 'm';
    if (lowerCol.includes('speed')) return 'km/h';
    return '';
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button 
          variant={timeRange === 'all' ? 'default' : 'outline'}
          onClick={() => setTimeRange('all')}
        >
          All Data
        </Button>
        <Button 
          variant={timeRange === 'daily' ? 'default' : 'outline'}
          onClick={() => setTimeRange('daily')}
        >
          Daily
        </Button>
        <Button 
          variant={timeRange === 'weekly' ? 'default' : 'outline'}
          onClick={() => setTimeRange('weekly')}
        >
          Weekly
        </Button>
        <Button 
          variant={timeRange === 'monthly' ? 'default' : 'outline'}
          onClick={() => setTimeRange('monthly')}
        >
          Monthly
        </Button>
        <Button 
          variant={timeRange === 'yearly' ? 'default' : 'outline'}
          onClick={() => setTimeRange('yearly')}
        >
          Yearly
        </Button>
      </div>

      <div className="w-full h-[400px]">
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
            {valueColumns.map((col, index) => (
              <YAxis 
                key={`yAxis-${col}`}
                yAxisId={index}
                orientation={index === 0 ? 'left' : 'right'}
                label={{ 
                  value: `${col} (${getUnit(col)})`, 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
            ))}
            <Tooltip 
              labelFormatter={(timestamp) => {
                if (typeof timestamp === 'number') {
                  return format(new Date(timestamp), 'MMM dd, yyyy HH:mm:ss');
                }
                return timestamp;
              }}
              formatter={(value: number, name: string) => [
                `${value.toFixed(2)} ${getUnit(name)}`,
                name
              ]}
            />
            <Legend />
            {valueColumns.map((col, index) => (
              <Line
                key={col}
                yAxisId={index}
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
    </div>
  );
};