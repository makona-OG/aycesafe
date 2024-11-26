import { Card } from "@/components/ui/card";

interface StatisticalSummaryProps {
  data: string[][];
  columns: string[];
}

export const StatisticalSummary = ({ data, columns }: StatisticalSummaryProps) => {
  const calculateStats = (colIndex: number) => {
    const numbers = data.slice(1).map(row => parseFloat(row[colIndex])).filter(n => !isNaN(n));
    
    if (numbers.length === 0) return null;

    const sum = numbers.reduce((a, b) => a + b, 0);
    const mean = sum / numbers.length;
    const sortedNums = [...numbers].sort((a, b) => a - b);
    const median = sortedNums[Math.floor(sortedNums.length / 2)];
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    
    return { mean, median, min, max };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {columns.map((col, index) => {
        const stats = calculateStats(index);
        if (!stats) return null;

        return (
          <Card key={col} className="p-4">
            <h3 className="font-semibold mb-2">{col}</h3>
            <div className="space-y-2 text-sm">
              <p>Mean: {stats.mean.toFixed(2)}</p>
              <p>Median: {stats.median.toFixed(2)}</p>
              <p>Min: {stats.min.toFixed(2)}</p>
              <p>Max: {stats.max.toFixed(2)}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};