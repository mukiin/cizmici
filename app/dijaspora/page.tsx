import type { Metadata } from "next";
import Link from "next/link";
import { DiasporaMapLoader } from "@/components/DiasporaMapLoader";
import { MockNote } from "@/components/MockNote";
import { PageBand } from "@/components/PageBand";
import { dijaspora } from "@/lib/data";

export const metadata: Metadata = { title: "Dijaspora" };

export default function DijasporaPage() {
  return (
    <>
      <PageBand
        kicker="Dijaspora"
        title="Gdje su danas Čizmićani?"
        lead="Korisnici će dobrovoljno označiti u profilu gdje trenutno žive. Mapa raste kako se ljudi pridružuju."
      />
      <section className="tight">
        <div className="wrap">
          <MockNote>{dijaspora.note}</MockNote>
          <div className="total-banner">
            <div>
              <div className="n">{dijaspora.total}</div>
              <div className="l">
                Čizmićana povezano iz {dijaspora.countriesCount} zemalja — ilustracija
              </div>
            </div>
            <button type="button" className="ghost-btn" disabled>
              + Označi svoju lokaciju
            </button>
          </div>
          <DiasporaMapLoader data={dijaspora} />
          <div className="diaspora-stats">
            {dijaspora.countries.map((c) => (
              <div className="dstat" key={c.name}>
                <div className="flag">{c.flag}</div>
                <div className="n">{c.count}</div>
                <div className="l">{c.name}</div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 28, fontSize: "0.9rem", color: "rgba(33,29,22,0.6)" }}>
            Pogledaj i <Link href="/pozdravi">zid pozdrava iz dijaspore</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
