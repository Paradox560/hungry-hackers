'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

export type Site = {
  name: string
  address: string
  phone: string
  hours: string
  requirements?: string
  lat: number
  lng: number
}

type Props = {
  sites: Site[]
}

const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

export default function FoodMap({ sites }: Props) {
  // Default map center (DC)
  const center = sites.length > 0 ? [sites[0].lat, sites[0].lng] : [38.89511, -77.03637]

  return (
    <div className="mt-6 h-[400px] w-full">
      <MapContainer center={center as [number, number]} zoom={11} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {sites.map((site, i) => (
          <Marker position={[site.lat, site.lng]} key={i} icon={icon}>
            <Popup>
              <strong>{site.name}</strong><br />
              {site.address}<br />
              {site.hours}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
