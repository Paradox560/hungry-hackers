'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { Site } from './FoodMap'

type Props = {
  sites: Site[]
}

export default function FoodMap({ sites }: Props) {
  return (
    <div className="h-96 w-full my-4">
      <MapContainer
        center={[38.89511, -77.03637]}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sites.map((site, i) => (
          <Marker key={i} position={[site.lat, site.lng]}>
            <Popup>
              <strong>{site.name}</strong><br />
              {site.address}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
