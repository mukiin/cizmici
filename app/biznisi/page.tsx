import type { Metadata } from "next";
import { PageBand } from "@/components/PageBand";
import { SourceBadge } from "@/components/SourceBadge";
import { biznisi } from "@/lib/data";

export const metadata: Metadata = { title: "Biznisi" };

export default function BiznisiPage() {
  return (
    <>
      <PageBand
        kicker="06 — Privreda"
        title="Naši biznisi"
        lead="Javno registrovana privredna društva i obrti sa adresom u Čizmićima."
      />
      <section className="tight alt">
        <div className="wrap">
          <p style={{ marginBottom: 24 }}>
            <SourceBadge kind="public" label="poslovni registar" />
          </p>
          <div className="biz-grid">
            {biznisi.map((b) => (
              <div className="biz-card" key={b.name}>
                <span className="tag">{b.tag}</span>
                <h3>{b.name}</h3>
                <p>{b.body}</p>
                <div className="founded">
                  {b.founded} · {b.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
