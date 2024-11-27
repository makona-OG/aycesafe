import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Define sensor locations
const sensorLocations: Array<{ position: [number, number]; name: string }> = [
  { position: [-1.2921, 36.8219], name: "Sensor Location 1" },
  { position: [-1.2974, 36.8066], name: "Sensor Location 2" }
];

// Calculate center point between two sensors
const centerPosition: [number, number] = [
  (sensorLocations[0].position[0] + sensorLocations[1].position[0]) / 2,
  (sensorLocations[0].position[1] + sensorLocations[1].position[1]) / 2
];

export const LocationMap = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Sensor Locations</h2>
      <MapContainer 
        className="h-[400px] w-full"
        center={centerPosition}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sensorLocations.map((sensor, index) => (
          <Marker key={index} position={sensor.position}>
            <Popup>
              {sensor.name}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};