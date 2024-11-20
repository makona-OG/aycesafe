import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { WaterLevelGauge } from "@/components/Dashboard/WaterLevelGauge";
import { HistoricalChart } from "@/components/Dashboard/HistoricalChart";
import { WeatherDisplay } from "@/components/Dashboard/WeatherInfo";
import { AlertStatus } from "@/components/Dashboard/AlertStatus";

// Mock data - In a real app, this would come from an API
const mockWaterLevel = {
  level: 2.5,
  timestamp: new Date().toISOString(),
  status: 'warning' as const
};

const mockHistoricalData = Array.from({ length: 24 }, (_, i) => ({
  timestamp: new Date(Date.now() - i * 3600000).toISOString(),
  level: 2 + Math.random()
})).reverse();

const mockWeather = {
  temperature: 22,
  condition: "Light Rain",
  rainfall: 15
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="container mx-auto py-8 px-4 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AlertStatus status={mockWaterLevel.status} />
          </div>
          <div>
            <WaterLevelGauge data={mockWaterLevel} />
          </div>
          <div className="lg:col-span-2">
            <HistoricalChart data={mockHistoricalData} />
          </div>
          <div>
            <WeatherDisplay data={mockWeather} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;