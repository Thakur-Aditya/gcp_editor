'use client';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issue
const icon = L.icon({
  iconUrl: '/marker-icon.png',
  iconRetinaUrl: '/marker-icon-2x.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// MapEvents component for handling clicks
function MapEvents({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e);
    },
  });
  return null;
}

export default function PointsEditor({ points = [] }) {
  const [markers, setMarkers] = useState(points);

  const handleMapClick = (event) => {
    const { lat, lng } = event.latlng;
    const newPoint = {
      latitude: lat,
      longitude: lng,
      elevation: 0 // Default elevation
    };
    setMarkers([...markers, newPoint]);
  };

  return (
    <div className="h-[500px] w-full relative">
      <MapContainer
        center={[28.6139, 77.2090]}
        zoom={13}
        className="w-full h-full rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents onMapClick={handleMapClick} />
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={[marker.latitude, marker.longitude]}
            icon={icon}
          />
        ))}
      </MapContainer>

      <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow z-[1000]">
        <h3 className="font-bold mb-2">Points ({markers.length})</h3>
        <div className="max-h-48 overflow-y-auto">
          {markers.map((marker, index) => (
            <div key={index} className="text-sm mb-2">
              Point {index + 1}: {marker.latitude.toFixed(4)}, {marker.longitude.toFixed(4)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}