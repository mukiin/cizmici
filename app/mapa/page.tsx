import type { Metadata } from "next";
import { LocalMapLoader } from "@/components/LocalMapLoader";
import { PageBand } from "@/components/PageBand";
import { mapa } from "@/lib/data";

export const metadata: Metadata = { title: "Mapa" };

export default function MapaPage() {
  return (
    <>
      <PageBand kicker="04 — Teren" title="Mapa Čizmića" lead={mapa.intro} />
      <section className="tight alt">
        <div className="wrap">
          <LocalMapLoader data={mapa} />
          <div className="map-legend">
            {mapa.markers.map((m) => (
              <span key={m.legend}>
                <i style={{ background: m.color }} />
                {m.legend}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
