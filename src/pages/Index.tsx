import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { WaterLevelGauge } from "@/components/Dashboard/WaterLevelGauge";
import { HistoricalChart } from "@/components/Dashboard/HistoricalChart";
import { WeatherDisplay } from "@/components/Dashboard/WeatherInfo";
import { AlertStatus } from "@/components/Dashboard/AlertStatus";
import { LocationMap } from "@/components/Dashboard/LocationMap";
import { useState, useEffect } from "react";
import { WaterLevelData, WeatherInfo } from "@/lib/types";
import { fetchWeatherData } from "@/services/weatherService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { sendSMSAlert } from "@/services/smsService";
import { toast } from "sonner";

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

  const [phoneNumber, setPhoneNumber] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

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

  // Send SMS updates periodically when enabled
  useEffect(() => {
    if (!notificationsEnabled || !phoneNumber) return;

    const sendUpdate = async () => {
      const message = `
🌊 Water Level Update:
Level: ${waterLevel.level}m
Status: ${waterLevel.status.toUpperCase()}
Temperature: ${weather.temperature}°C
Condition: ${weather.condition}
Rainfall: ${weather.rainfall}mm
      `.trim();

      try {
        await sendSMSAlert(message);
        toast.success("Status update sent to your phone");
      } catch (error) {
        toast.error("Failed to send status update");
        setNotificationsEnabled(false);
      }
    };

    // Send initial update
    sendUpdate();

    // Set up periodic updates every 30 minutes
    const interval = setInterval(sendUpdate, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [notificationsEnabled, phoneNumber, waterLevel, weather]);

  const mockHistoricalData = Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    level: 2 + Math.random()
  })).reverse();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="container mx-auto py-8 px-4 flex-grow">
        <div className="mb-6 p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">SMS Notifications</h2>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="max-w-xs"
              />
              <div className="flex items-center space-x-2">
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                  disabled={!phoneNumber}
                />
                <Label htmlFor="notifications">Enable SMS updates</Label>
              </div>
            </div>
            {!phoneNumber && (
              <p className="text-sm text-muted-foreground">
                Enter your phone number to receive SMS updates about water levels and weather conditions.
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AlertStatus status={waterLevel.status} />
          </div>
          <div>
            <WaterLevelGauge data={waterLevel} />
          </div>
          <div className="lg:col-span-2">
            <HistoricalChart data={mockHistoricalData} />
          </div>
          <div>
            <WeatherDisplay data={weather} />
          </div>
          <div className="lg:col-span-3">
            <LocationMap />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
