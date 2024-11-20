import { WaterLevelData } from "@/lib/types";
import { DropletIcon } from "lucide-react";

interface Props {
  data: WaterLevelData;
}

export const WaterLevelGauge = ({ data }: Props) => {
  const getStatusColor = (status: WaterLevelData['status']) => {
    switch (status) {
      case 'safe': return 'bg-alert-safe';
      case 'warning': return 'bg-alert-warning';
      case 'danger': return 'bg-alert-danger';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Current Water Level</h2>
        <DropletIcon className={`h-6 w-6 ${data.status === 'danger' ? 'animate-pulse-slow text-alert-danger' : 'text-primary'}`} />
      </div>
      <div className="flex flex-col items-center">
        <div className="text-4xl font-bold mb-2">{data.level}m</div>
        <div className={`px-4 py-1 rounded-full text-white ${getStatusColor(data.status)}`}>
          {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
        </div>
      </div>
      <div className="text-sm text-gray-500 mt-4">
        Last updated: {new Date(data.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};