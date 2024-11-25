import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { fetchWeatherData } from '@/services/weatherService';
import { useToast } from '@/components/ui/use-toast';
import { WeatherInfo } from '@/lib/types';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
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

// Component to handle map center updates
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
            toast({
              title: "Weather Updated",
              description: `Current temperature: ${weatherData.temperature}°C, ${weatherData.condition}`,
            });
          } catch (error) {
            console.error('Error fetching weather:', error);
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
        center={[51.505, -0.09]} 
        zoom={13} 
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