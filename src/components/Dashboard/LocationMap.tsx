import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { fetchWeatherData } from '@/services/weatherService';
import { useToast } from '@/components/ui/use-toast';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationData {
  lat: number;
  lng: number;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export const LocationMap = () => {
  const [location, setLocation] = useState<LocationData>({ lat: 51.505, lng: -0.09 });
  const { toast } = useToast();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          setLocation({ lat, lng });

          try {
            const weatherData = await fetchWeatherData(lat, lng);
            const rainfallMessage = weatherData.rainfall > 0 
              ? `Current rainfall: ${weatherData.rainfall}mm`
              : 'No rainfall detected';
              
            toast({
              title: "Weather Updated",
              description: `Temperature: ${weatherData.temperature}°C\n${rainfallMessage}`,
            });
          } catch (error) {
            console.error('Error fetching weather:', error);
            toast({
              title: "Error",
              description: "Failed to fetch weather data",
              variant: "destructive",
            });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Error",
            description: "Could not get your location. Please enable location services.",
            variant: "destructive",
          });
        }
      );
    }
  }, [toast]);

  return (
    <div className="w-full h-[400px] rounded-lg shadow-lg overflow-hidden">
      <MapContainer 
        style={{ height: '100%', width: '100%' }}
        defaultCenter={[location.lat, location.lng]} 
        defaultZoom={13}
        scrollWheelZoom={false}
      >
        <MapUpdater center={[location.lat, location.lng]} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[location.lat, location.lng]}>
          <Popup>
            <div className="p-2">
              <div className="font-semibold">Your Location</div>
              <div className="text-sm">Lat: {location.lat.toFixed(4)}</div>
              <div className="text-sm">Lng: {location.lng.toFixed(4)}</div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};