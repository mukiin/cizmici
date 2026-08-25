import type { Metadata } from "next";
import { MockNote } from "@/components/MockNote";
import { PageBand } from "@/components/PageBand";
import { prijave } from "@/lib/data";

export const metadata: Metadata = { title: "Prijave" };

export default function PrijavePage() {
  return (
    <>
      <PageBand
        kicker="Komunalno"
        title="Prijava problema"
        lead="Forma i statusi su spremni vizuelno. Slanje i obrada čekaju backend — ništa se još ne snima."
      />
      <section className="tight">
        <div className="wrap">
          <MockNote>
            Ovo je pregled ekrana. Dugme ne šalje prijavu. Primjeri na desnoj strani su izmišljeni radi izgleda.
          </MockNote>
          <div className="grid-2">
            <div className="screen-card">
              <div className="field disabled">
                <label htmlFor="vrsta">Vrsta problema</label>
                <select id="vrsta" disabled defaultValue="put">
                  <option value="put">Oštećen put</option>
                  <option value="rasvjeta">Rasvjeta</option>
                  <option value="deponija">Divlja deponija</option>
                </select>
              </div>
              <div className="field disabled">
                <label htmlFor="lokacija">Lokacija</label>
                <input id="lokacija" placeholder="npr. put Čizmići–Kapići" disabled />
              </div>
              <div className="field disabled">
                <label htmlFor="opis">Opis</label>
                <textarea id="opis" rows={3} placeholder="Opišite problem..." disabled />
              </div>
              <button type="button" className="btn primary disabled" disabled>
                Pošalji prijavu
              </button>
            </div>
            <div className="screen-card">
              {prijave.items.map((item) => (
                <div className="issue-row" key={item.title}>
                  <div className="issue-thumb" />
                  <div style={{ flex: 1 }}>
                    <h4>{item.title}</h4>
                    <div className="meta">{item.meta}</div>
                  </div>
                  <span className={`status-pill ${item.status}`}>{item.statusLabel}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
