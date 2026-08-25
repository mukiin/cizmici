"use client";

import dynamic from "next/dynamic";
import type { Diaspora } from "@/lib/types";

const DiasporaMap = dynamic(() => import("./DiasporaMap"), {
  ssr: false,
  loading: () => <div className="map-frame world" />,
});

export function DiasporaMapLoader({ data }: { data: Diaspora }) {
  return (
    <div className="map-frame world">
      <DiasporaMap data={data} />
    </div>
  );
}
