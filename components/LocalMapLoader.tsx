"use client";

import dynamic from "next/dynamic";
import type { MapData } from "@/lib/types";

const LocalMap = dynamic(() => import("./LocalMap"), {
  ssr: false,
  loading: () => <div className="map-frame" />,
});

export function LocalMapLoader({ data }: { data: MapData }) {
  return (
    <div className="map-frame">
      <LocalMap data={data} />
    </div>
  );
}
