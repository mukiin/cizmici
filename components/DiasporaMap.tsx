"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Diaspora } from "@/lib/types";

function pin(n: number, color: string) {
  const size = 14 + Math.min(n / 4, 26);
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};opacity:0.85;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;color:white;font-family:IBM Plex Mono,monospace;font-size:10px;">${n}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function DiasporaMap({ data }: { data: Diaspora }) {
  return (
    <MapContainer
      center={[48, 12]}
      zoom={4}
      scrollWheelZoom={false}
      worldCopyJump
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[data.home.lat, data.home.lng]}>
        <Popup>
          <b>{data.home.name}</b>
        </Popup>
      </Marker>
      {data.countries.map((c) => (
        <Marker key={c.name} position={[c.lat, c.lng]} icon={pin(c.count, "#2f4a3c")}>
          <Popup>
            <b>{c.name}</b>
            <br />
            {c.count} povezanih (ilustracija)
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
