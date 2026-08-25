import type { Metadata } from "next";
import { PageBand } from "@/components/PageBand";
import { projekti } from "@/lib/data";

export const metadata: Metadata = { title: "Projekti" };

export default function ProjektiPage() {
  return (
    <>
      <PageBand
        kicker="05 — Transparentnost"
        title="Projekti u zajednici"
        lead="Investicije Grada Cazina i zajednice u MZ Čizmići, po dostupnim aktima."
      />
      <section className="tight">
        <div className="wrap">
          <div className="proj-grid">
            {projekti.map((p) => (
              <div className="proj-card" key={p.title}>
                <span className={`status ${p.status}`}>{p.statusLabel}</span>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                <div className="meta">
                  <span>{p.year}</span>
                  <span>{p.meta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
