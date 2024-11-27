import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom icon setup for the marker
const customIcon = L.icon({
  iconUrl: '/placeholder.svg',
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25],
});

const LocationMap = () => {
  // Fixed coordinates for the sensor location
  const sensorPosition: [number, number] = [51.505, -0.09];

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border border-border">
      <MapContainer 
        className="h-full w-full"
        center={sensorPosition}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker 
          position={sensorPosition}
          icon={customIcon}
        >
          <Popup>
            Sensor Location
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LocationMap;