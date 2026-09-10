import type { Metadata } from "next";
import { MockNote } from "@/components/MockNote";
import { PageBand } from "@/components/PageBand";
import { getPozdravi } from "@/lib/data";

export const metadata: Metadata = { title: "Pozdravi" };

export default async function PozdraviPage() {
  const pozdravi = await getPozdravi();
  return (
    <>
      <PageBand
        kicker="Zid poruka"
        title="Pozdravi iz dijaspore"
        lead="Kratke poruke koje dijaspora ostavlja mjestu — posebno oko Bajrama i Dana MZ."
      />
      <section className="tight alt">
        <div className="wrap">
          <MockNote>{pozdravi.note}</MockNote>
          <div className="greet-grid">
            {pozdravi.items.map((g) => (
              <article className="greet-card" key={`${g.name}-${g.loc}`}>
                <div className="who">
                  <span className="name">{g.name}</span>
                  <span className="loc">{g.loc}</span>
                </div>
                <p>{g.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
