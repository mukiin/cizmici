import type { Metadata } from "next";
import { MockNote } from "@/components/MockNote";
import { PageBand } from "@/components/PageBand";
import { price } from "@/lib/data";

export const metadata: Metadata = { title: "Priče" };

export default function PricePage() {
  return (
    <>
      <PageBand
        kicker="Priče i ljudi"
        title="Priče Čizmića"
        lead="Ovdje će stajati prilozi mještana. Za sada su kartice mjesto-držači — sadržaj se prikuplja."
      />
      <section className="tight">
        <div className="wrap">
          <MockNote>
            Prve priče se mogu unijeti ručno. Slanje od strane mještana dolazi kad krene registracija.
          </MockNote>
          <div className="story-grid">
            {price.map((s) => (
              <div className="story-card" key={s.title}>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
                {s.soon ? <span className="soon">Uskoro</span> : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
