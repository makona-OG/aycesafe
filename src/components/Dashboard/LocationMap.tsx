import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export const LocationMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
        version: 'weekly',
        libraries: ['maps']
      });

      const { Map } = await loader.importLibrary('maps');
      const { Marker } = await google.maps.importLibrary('marker');

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const map = new Map(mapRef.current!, {
              center: { lat: latitude, lng: longitude },
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

            new Marker({
              position: { lat: latitude, lng: longitude },
              map,
              title: 'Your Location'
            });
          },
          (error) => {
            console.error('Error getting location:', error);
          }
        );
      }
    };

    initMap();
  }, []);

  return <div ref={mapRef} className="w-full h-[400px] rounded-lg shadow-lg" />;
};