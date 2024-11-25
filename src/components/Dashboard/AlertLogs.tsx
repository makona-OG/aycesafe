import { WaterLevelData } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

interface AlertLog {
  timestamp: string;
  status: WaterLevelData['status'];
  message: string;
}

interface Props {
  logs: AlertLog[];
}

export const AlertLogs = ({ logs }: Props) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Alert History</h2>
      <ScrollArea className="h-[300px]">
        <div className="space-y-4">
          {logs.map((log, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                log.status === 'danger'
                  ? 'bg-red-50 border-l-4 border-red-500'
                  : log.status === 'warning'
                  ? 'bg-yellow-50 border-l-4 border-yellow-500'
                  : 'bg-green-50 border-l-4 border-green-500'
              }`}
            >
              <p className="font-medium">{log.message}</p>
              <p className="text-sm text-gray-500 mt-1">
                {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};