import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { fetchWeatherData } from '@/services/weatherService';
import { useToast } from '@/components/ui/use-toast';
import { WeatherInfo } from '@/lib/types';

interface LocationData {
  lat: number;
  lng: number;
}

export const LocationMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: 'AIzaSyDHvx4GtqfVFiKz-zrZxY6GQJr_wYl4nqI',
        version: 'weekly',
        libraries: ['maps', 'marker']
      });

      const { Map } = await loader.importLibrary('maps') as google.maps.MapsLibrary;
      const { AdvancedMarkerElement } = await loader.importLibrary('marker') as google.maps.MarkerLibrary;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude: lat, longitude: lng } = position.coords;
            setLocation({ lat, lng });

            const map = new Map(mapRef.current!, {
              center: { lat, lng },
              zoom: 15,
              styles: [
                {
                  elementType: "geometry",
                  stylers: [{ color: "#242f3e" }]
                },
                {
                  elementType: "labels.text.stroke",
                  stylers: [{ color: "#242f3e" }]
                },
                {
                  elementType: "labels.text.fill",
                  stylers: [{ color: "#746855" }]
                }
              ]
            });

            // Create a custom marker element
            const markerElement = document.createElement('div');
            markerElement.className = 'custom-marker';
            markerElement.innerHTML = `
              <div class="bg-white p-2 rounded-lg shadow-lg border-2 border-primary">
                <div class="font-semibold text-primary">Your Location</div>
                <div class="text-sm text-gray-600">Lat: ${lat.toFixed(4)}</div>
                <div class="text-sm text-gray-600">Lng: ${lng.toFixed(4)}</div>
              </div>
            `;

            // Create and add the custom marker to the map
            new AdvancedMarkerElement({
              position: { lat, lng },
              map,
              content: markerElement
            });

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
    };

    initMap();
  }, [toast]);

  return <div ref={mapRef} className="w-full h-[400px] rounded-lg shadow-lg" />;
};