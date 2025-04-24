'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Papa from 'papaparse';

const geocodeAddress = async (address) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data && data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    };
  }
  return null;
};

const FoodBankMap = () => {
  const [locations, setLocations] = useState([]);

  const loadAndGeocode = async (filename) => {
    return new Promise((resolve) => {
      Papa.parse(`/data/${filename}`, {
        header: true,
        download: true,
        complete: async (results) => {
          const geocoded = [];
          for (const row of results.data) {
            const address = row['Shipping Address'];
            if (address) {
              const coords = await geocodeAddress(address);
              if (coords) {
                geocoded.push({ ...coords, address });
              }
            }
          }
          resolve(geocoded);
        },
      });
    });
  };

  useEffect(() => {
    const fetchAll = async () => {
      const [partners, markets] = await Promise.all([
        loadAndGeocode('shopping_partners.csv'),
        loadAndGeocode('mobile_markets.csv'),
      ]);
      setLocations([...partners, ...markets]);
    };

    fetchAll();
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={[38.9072, -77.0369]} zoom={11} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {locations.map((loc, index) => (
          <Marker key={index} position={[loc.lat, loc.lon]}>
            <Popup>{loc.address}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default FoodBankMap;
