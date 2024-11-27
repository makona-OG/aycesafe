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
  // Fixed coordinates for the sensor locations
  const sensorPosition1: [number, number] = [-0.406667, 36.962936];
  const sensorPosition2: [number, number] = [-0.406600, 36.962637];

  // Center the map between the two points
  const centerPosition: [number, number] = [
    (sensorPosition1[0] + sensorPosition2[0]) / 2,
    (sensorPosition1[1] + sensorPosition2[1]) / 2
  ];

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border border-border">
      <MapContainer 
        className="h-full w-full"
        center={centerPosition}
        zoom={18}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker 
          position={sensorPosition1}
        >
          <Popup>
            Sensor Location 1
          </Popup>
        </Marker>
        <Marker 
          position={sensorPosition2}
        >
          <Popup>
            Sensor Location 2
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LocationMap;