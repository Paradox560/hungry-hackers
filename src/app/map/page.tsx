"use client";

import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import Image from "next/image";
import L from "leaflet";
import Papa from "papaparse";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "@/i18n";
import TranslatedText from "@/components/TranslatedText";

// Fix Leaflet Icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Interfaces
interface FoodBank {
  lat: number;
  lon: number;
  address: string;
}

interface MapUpdaterProps {
  center: [number, number];
}

// MapUpdater Component
function MapUpdater({ center }: MapUpdaterProps) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

// Utility Functions
function cleanAddress(raw: string): string {
  const match = raw.match(/\d{1,5} .*/);
  return match ? match[0] : raw;
}

const geocodeAddress = async (
  address: string
): Promise<{
  lat: number;
  lon: number;
} | null> => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    address
  )}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "leaflet-map-example/1.0",
      },
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

// Chatbot Component
const Chatbot: React.FC = () => {
  const handleClick = () => {
    alert("Working on adding a chatbot");
  };

  return (
    <div
      className="chatbot-icon"
      onClick={handleClick}
      style={{
        position: "fixed",
        bottom: "650px",
        right: "20px",
        cursor: "pointer",
      }}
    >
      <Image
        width={80}
        height={80}
        src="/chat_icon.png"
        alt="Chatbot Icon"
        style={{
          width: "100px",
          height: "100px",
          zIndex: "1000",
          margin: "10px",
        }}
      />
    </div>
  );
};

// Main Component
export default function MapPage() {
  const [center, setCenter] = useState<[number, number]>([38.89511, -77.03637]); // Default DC
  const [foodBanks, setFoodBanks] = useState<FoodBank[]>([]);
  const addressRef = useRef<HTMLInputElement>(null);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { t, locale } = useTranslation();

  // Load translations whenever the locale changes.
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      const keys = [
        "map.title",
        "map.description",
        "map.enterAddress",
        "map.locate",
        "map.useMyLocation",
      ];

      const translatedTexts: Record<string, string> = {};
      for (const key of keys) {
        translatedTexts[key] = await t(key);
      }

      setTranslations(translatedTexts);
      setIsLoading(false);
    };

    loadTranslations();
  }, [locale]); // Added locale here

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });
  }, []);

  const loadAndGeocode = async () => {
    const files = ["shopping_partners.csv", "mobile_markets.csv"];
    const allAddresses: string[] = [];

    for (let file of files) {
      const response = await fetch(`/data/${file}`);
      const text = await response.text();
      const parsed = Papa.parse(text, { header: true });
      parsed.data.forEach((row: any) => {
        if (row["Shipping Address"]) {
          allAddresses.push(cleanAddress(row["Shipping Address"]));
        }
      });
    }

    const geocoded: FoodBank[] = [];
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
    const input = addressRef.current?.value;
    if (!input) return;

    const coords = await geocodeAddress(input);
    if (coords) {
      setCenter([coords.lat, coords.lon]);
    } else {
      alert("Could not locate that address.");
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div style={{ color: "black" }}>
      <div style={{ padding: "10px", backgroundColor: "#f2f2f2" }}>
        <h2 style={{ marginBottom: "5px" }}>{translations["map.title"]}</h2>
        <p>{translations["map.description"]}</p>
        <div style={{ marginBottom: "10px" }}>
          <input
            ref={addressRef}
            type="text"
            placeholder={translations["map.enterAddress"]}
            style={{ padding: "5px", width: "300px", border: "1px solid #ccc" }}
          />
          <button onClick={handleAddressSearch} style={{ marginLeft: "5px" }}>
            {translations["map.locate"]}
          </button>
        </div>
        <button onClick={locateUser} style={{ margin: "10px" }}>
          {translations["map.useMyLocation"]}
        </button>
      </div>

      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "80vh", width: "100%" }}
      >
        <MapUpdater center={center} />
        <TileLayer
          attribution="© OpenStreetMap contributors"
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
