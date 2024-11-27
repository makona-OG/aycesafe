import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom icon setup for the marker
const customIcon = new L.Icon({
  iconUrl: '/placeholder.svg',
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25],
});

const LocationMap = () => {
  const defaultPosition: [number, number] = [51.505, -0.09]; // Default to London coordinates

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border border-border">
      <MapContainer 
        className="h-full w-full"
        center={defaultPosition}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker 
          position={defaultPosition}
          icon={customIcon}
        >
          <Popup>
            Water Level Monitoring Station
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LocationMap;