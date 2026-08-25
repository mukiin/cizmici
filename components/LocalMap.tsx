"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MapData } from "@/lib/types";

function pin(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="width:16px;height:16px;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.4)"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 16],
  });
}

function FitView({ data }: { data: MapData }) {
  const map = useMap();
  useEffect(() => {
    const points: [number, number][] = [
      ...(data.path ?? []),
      ...data.markers.map((m) => [m.lat, m.lng] as [number, number]),
    ];
    if (points.length >= 2) {
      map.fitBounds(points, { padding: [36, 36], maxZoom: 17 });
    } else {
      map.setView(data.center, data.zoom);
    }
  }, [data, map]);
  return null;
}

export default function LocalMap({ data }: { data: MapData }) {
  const icons = useMemo(
    () => Object.fromEntries(data.markers.map((m) => [`${m.title}-${m.lat}`, pin(m.color)])),
    [data.markers],
  );

  return (
    <MapContainer
      center={data.center}
      zoom={data.zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitView data={data} />
      {data.path && data.path.length >= 2 ? (
        <Polyline positions={data.path} pathOptions={{ color: "#a6502e", weight: 5, opacity: 0.9 }} />
      ) : null}
      {data.markers.map((m) => (
        <Marker key={`${m.title}-${m.lat}`} position={[m.lat, m.lng]} icon={icons[`${m.title}-${m.lat}`]}>
          <Popup>
            <b>{m.title}</b>
            <br />
            {m.body}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
