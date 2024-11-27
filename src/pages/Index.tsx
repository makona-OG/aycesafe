import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { WaterLevelGauge } from "@/components/Dashboard/WaterLevelGauge";
import { HistoricalChart } from "@/components/Dashboard/HistoricalChart";
import { WeatherDisplay } from "@/components/Dashboard/WeatherInfo";
import { AlertStatus } from "@/components/Dashboard/AlertStatus";
import LocationMap from "@/components/Dashboard/LocationMap";
import { AlertLogs } from "@/components/Dashboard/AlertLogs";
import { useState, useEffect } from "react";
import { WaterLevelData, WeatherInfo } from "@/lib/types";
import { fetchWeatherData } from "@/services/weatherService";

const Index = () => {
  const [waterLevel, setWaterLevel] = useState<WaterLevelData>({
    level: 2.5,
    timestamp: new Date().toISOString(),
    status: 'safe'
  });

  const [weather, setWeather] = useState<WeatherInfo>({
    temperature: 22,
    condition: "Loading...",
    rainfall: 0
  });

  const [alertLogs, setAlertLogs] = useState<any[]>([]);

  // Simulate water level changes for demonstration
  useEffect(() => {
    const interval = setInterval(() => {
      const newLevel = 2 + Math.random() * 2; // Random between 2-4 meters
      const status = newLevel > 3.5 ? 'danger' : newLevel > 3 ? 'warning' : 'safe';
      
      setWaterLevel({
        level: Number(newLevel.toFixed(2)),
        timestamp: new Date().toISOString(),
        status
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Update weather when location is available
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const weatherData = await fetchWeatherData(
            position.coords.latitude,
            position.coords.longitude
          );
          setWeather(weatherData);
        } catch (error) {
          console.error('Error fetching weather:', error);
        }
      });
    }
  }, []);

  const handleAlertSent = (log: any) => {
    setAlertLogs(prevLogs => [log, ...prevLogs]);
  };

  const mockHistoricalData = Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    level: 2 + Math.random()
  })).reverse();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow p-6">
        <div className="container mx-auto space-y-6">
          {/* Top Row - Critical Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <AlertStatus 
                status={waterLevel.status}
                onAlertSent={handleAlertSent}
              />
            </div>
            <div>
              <WaterLevelGauge data={waterLevel} />
            </div>
          </div>

          {/* Middle Row - Charts and Weather */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Historical Water Levels</h2>
                <HistoricalChart data={mockHistoricalData} />
              </div>
            </div>
            <div>
              <WeatherDisplay data={weather} />
            </div>
          </div>

          {/* Bottom Row - Map and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Sensor Location</h2>
                <LocationMap />
              </div>
            </div>
            <div>
              <AlertLogs logs={alertLogs} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
