import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import Papa from 'papaparse';
import 'leaflet/dist/leaflet.css';
import './App.css';
import Chatbot from './Chatbot';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function LocateButton({ onLocate }) {
  return (
    <button onClick={onLocate} style={{ margin: '10px' }}>
      📍 Use My Location
    </button>
  );
}

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

function cleanAddress(raw) {
  const match = raw.match(/\d{1,5} .*/);
  return match ? match[0] : raw;
}

const geocodeAddress = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'leaflet-map-example/1.0'
      }
    });
    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
    }
  } catch (error) {
    console.error("Geocoding error:", address, error);
  }

  return null;
};

function App() {
  const [center, setCenter] = useState([38.89511, -77.03637]); // default DC
  const [foodBanks, setFoodBanks] = useState([]);
  const addressRef = useRef();

  const loadAndGeocode = async () => {
    const files = ['shopping_partners.csv', 'mobile_markets.csv'];
    const allAddresses = [];

    for (let file of files) {
      const response = await fetch(`/data/${file}`);
      const text = await response.text();
      const parsed = Papa.parse(text, { header: true });
      parsed.data.forEach(row => {
        if (row["Shipping Address"]) {
          allAddresses.push(cleanAddress(row["Shipping Address"]));
        }
      });
    }

    const geocoded = [];
    for (let address of allAddresses) {
      const coords = await geocodeAddress(address);
      if (coords) {
        geocoded.push({ ...coords, address });
      } else {
        console.warn("Could not geocode:", address);
      }
    }

    setFoodBanks(geocoded);
  };

  useEffect(() => {
    loadAndGeocode();
  }, []);

  const locateUser = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setCenter([latitude, longitude]);
    });
  };

  const handleAddressSearch = async () => {
    const input = addressRef.current.value;
    const coords = await geocodeAddress(input);
    if (coords) {
      setCenter([coords.lat, coords.lon]);
    } else {
      alert("Could not locate that address.");
    }
  };

  return (
    <div>
      <div style={{ padding: '10px', backgroundColor: '#f2f2f2' }}>
        <h2 style={{ marginBottom: '5px' }}>🗺️ Find Food Banks Near You</h2>
        <p>
          Enter your address and click locate to find nearby food banks.<br />
          Ingrese su dirección y haga clic en localizar para encontrar bancos de alimentos cercanos.
        </p>
        <div style={{ marginBottom: '10px' }}>
          <input ref={addressRef} type="text" placeholder="Enter address..." style={{ padding: '5px', width: '300px' }} />
          <button onClick={handleAddressSearch} style={{ marginLeft: '5px' }}>📌 Locate</button>
        </div>
        <LocateButton onLocate={locateUser} />
      </div>

      <MapContainer center={center} zoom={12} style={{ height: "80vh", width: "100%" }}>
        <MapUpdater center={center} />
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {foodBanks.map((fb, idx) => (
          <Marker key={idx} position={[fb.lat, fb.lon]}>
            <Popup>{fb.address}</Popup>
          </Marker>
        ))}
      </MapContainer>
      <Chatbot />
    </div>
  );
}

export default App;
