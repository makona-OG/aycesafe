import { WeatherInfo as WeatherInfoType } from "@/lib/types";
import { CloudRainIcon, ThermometerIcon } from "lucide-react";

interface Props {
  data: WeatherInfoType;
}

export const WeatherDisplay = ({ data }: Props) => {
  const getRainfallColor = (rainfall: number) => {
    if (rainfall === 0) return 'text-gray-500';
    if (rainfall < 2.5) return 'text-blue-400';
    if (rainfall < 7.5) return 'text-blue-500';
    return 'text-blue-600';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Weather Conditions</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <ThermometerIcon className="text-primary" />
          <div>
            <div className="text-sm text-gray-500">Temperature</div>
            <div className="text-lg font-semibold">{data.temperature}°C</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <CloudRainIcon className={getRainfallColor(data.rainfall)} />
          <div>
            <div className="text-sm text-gray-500">Rainfall</div>
            <div className="text-lg font-semibold">
              {data.rainfall > 0 ? (
                <span className={getRainfallColor(data.rainfall)}>{data.rainfall}mm</span>
              ) : (
                <span>No rain</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-500">Condition</div>
        <div className="text-lg font-semibold">{data.condition}</div>
      </div>
    </div>
  );
};