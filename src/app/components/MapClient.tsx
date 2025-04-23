"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet Icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

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

interface MapComponentProps {
  center: [number, number];
  foodBanks: FoodBank[];
}

const MapComponent: React.FC<MapComponentProps> = ({ center, foodBanks }) => {
  useEffect(() => {
    // Fix Leaflet default icon issue
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x.src,
      iconUrl: markerIcon.src,
      shadowUrl: markerShadow.src,
    });
  }, []);

  return (
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
  );
};

export default MapComponent;