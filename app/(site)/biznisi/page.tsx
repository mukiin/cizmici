import type { Metadata } from "next";
import { PageBand } from "@/components/PageBand";
import { getBiznisi } from "@/lib/data";

export const metadata: Metadata = { title: "Biznisi" };

export default async function BiznisiPage() {
  const biznisi = await getBiznisi();
  return (
    <>
      <PageBand
        kicker="06 — Privreda"
        title="Naši biznisi"
        lead="Lokalna privreda — unosi se kad ima pouzdan izvor. Registrovane firme iz pretrage ovdje nisu navedene."
      />
      <section className="tight alt">
        <div className="wrap">
          {biznisi.length === 0 ? (
            <p style={{ fontSize: "0.95rem", color: "rgba(33,29,22,0.62)" }}>
              Još nema unesenih biznisa.
            </p>
          ) : (
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
          )}
        </div>
      </section>
    </>
  );
}
