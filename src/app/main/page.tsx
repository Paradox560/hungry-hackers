'use client';

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import L from 'leaflet';
import Papa from 'papaparse';
import 'leaflet/dist/leaflet.css';
import '@/styles/App.css';
import Chatbot from '@/components/Chatbot';
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerIconUrl2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Dynamically import react-leaflet components
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });
const useMap = dynamic(() => import('react-leaflet').then((mod) => mod.useMap), { ssr: false });

useEffect(() => {
  if (typeof window !== 'undefined') {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIconUrl2x,
      iconUrl: markerIconUrl,
      shadowUrl: markerShadowUrl,
    });
  }
}, []);

interface LocateButtonProps {
  onLocate: () => void;
}

function LocateButton({ onLocate }: LocateButtonProps) {
  return (
    <button onClick={onLocate} style={{ margin: '10px' }}>
      📍 Use My Location
    </button>
  );
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (center && map) {
      map.setView(center, 13);
    }
  }, [center, map]);

  return null;
}

interface CsvRow {
  'Shipping Address': string;
  Latitude: string;
  Longitude: string;
}

interface FoodBank {
  address: string;
  lat: number;
  lon: number;
  type: 'market' | 'shoppingPartner';
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in kilometers

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function MainPage() {
  const [center, setCenter] = useState<[number, number]>([38.89511, -77.03637]);
  const [foodBanks, setFoodBanks] = useState<FoodBank[]>([]);
  const addressRef = useRef<HTMLInputElement>(null);

  const loadFoodBanks = async () => {
    const files: { name: string; type: 'market' | 'shoppingPartner' }[] = [
      { name: 'mobile_markets_geocoded.csv', type: 'market' },
      { name: 'shopping_partners_geocoded.csv', type: 'shoppingPartner' },
    ];
    const allFoodBanks: FoodBank[] = [];

    for (const file of files) {
      try {
        console.log(`Loading file: ${file.name}`); // Debugging step
        const response = await fetch(`/data/${file.name}`);
        if (!response.ok) {
          console.error(`Failed to load ${file.name}:`, response.statusText);
          continue;
        }
        const text = await response.text();
        const parsed = Papa.parse<CsvRow>(text, { header: true });
        console.log(`Parsed data from ${file.name}:`, parsed.data); // Debugging step
        parsed.data.forEach((row) => {
          if (row['Shipping Address'] && row.Latitude && row.Longitude) {
            allFoodBanks.push({
              address: row['Shipping Address'],
              lat: parseFloat(row.Latitude),
              lon: parseFloat(row.Longitude),
              type: file.type,
            });
          }
        });
      } catch (error) {
        console.error(`Error loading ${file.name}:`, error);
      }
    }

    console.log('Loaded food banks:', allFoodBanks); // Debugging step
    setFoodBanks(allFoodBanks);
  };

  useEffect(() => {
    loadFoodBanks();
  }, []);

  useEffect(() => {
    console.log('Food banks state updated:', foodBanks); // Debugging step
  }, [foodBanks]);

  const locateUser = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      console.log('User location:', latitude, longitude); // Debugging step
      setCenter([latitude, longitude]);
    });
  };

  const handleAddressSearch = async () => {
    const input = addressRef.current?.value;
    const coords = await geocodeAddress(input || '');
    console.log('Address search result:', input, coords); // Debugging step
    if (coords) {
      setCenter([coords.lat, coords.lon]);

      const closestFoodBanks = foodBanks.filter((fb) => {
        const distance = calculateDistance(coords.lat, coords.lon, fb.lat, fb.lon);
        console.log(`Distance to ${fb.address}:`, distance); // Debugging step
        return distance <= 10; // Adjust the distance threshold as needed
      });

      console.log('Closest food banks:', closestFoodBanks); // Debugging step
      setFoodBanks(closestFoodBanks);
    } else {
      alert('Could not locate that address.');
    }
  };

  return (
    <div>
      <div style={{ padding: '10px', backgroundColor: '#f2f2f2' }}>
        <h2 style={{ marginBottom: '5px' }}>🗺️ Find Food Banks Near You</h2>
        <div style={{ marginBottom: '10px' }}>
          <input ref={addressRef} type="text" placeholder="Enter address..." style={{ padding: '5px', width: '300px' }} />
          <button onClick={handleAddressSearch} style={{ marginLeft: '5px' }}>
            📌 Locate
          </button>
        </div>
        <LocateButton onLocate={locateUser} />
      </div>

      <MapContainer center={center} zoom={13} style={{ height: '80vh', width: '100%' }}>
        <MapUpdater center={center} />
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {foodBanks.map((fb, idx) => {
          console.log('Rendering marker:', fb); // Debugging step
          return (
            <Marker
              key={idx}
              position={[fb.lat, fb.lon]}
              icon={fb.type === 'market' ? markerIconUrl : markerIconUrl2x}
            >
              <Popup>{fb.address}</Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <Chatbot />
    </div>
  );
}