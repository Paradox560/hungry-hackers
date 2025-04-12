import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './fix-leaflet-icons'; // This is optional but useful to fix icon issues

function App() {
  return (
    <div>
      <h2>My Leaflet Map</h2>
      <MapContainer center={[38.9072, -77.0369]} zoom={13} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[38.9072, -77.0369]}>
          <Popup>Hello from DC! 🏛️</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default App;
